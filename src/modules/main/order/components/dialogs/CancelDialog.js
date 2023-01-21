import React, {useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../../styles/styles';
import {BASE_URL, UPDATE_ORDER} from '../../../../../utils/apiUtilities';
import {reasons} from '../../utils/reasons';
import {postData} from '../../../../../utils/api';
import {cancelOrder} from '../../utils/orderHistoryUtils';
import {useSelector} from 'react-redux';
import {Button, Checkbox, Dialog, Menu, Text, withTheme,} from 'react-native-paper';

const CancelDialog = ({
  theme,
  setUpdateMessageId,
  order,
  showOverlay,
  setShowOverlay,
  breakup,
  updateType,
  setUpdateInProgress,
  updateInProgress,
  cancelInProgress,
  setCancelInProgress,
  setCancelMessageId,
}) => {
  const {colors} = theme;
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const productList = breakup.filter(
    one => one.product['@ondc/org/cancellable'],
  );

  const onPressHandler = (item, index) => {
    const items = selectedItem.slice();
    index > -1 ? items.splice(index, 1) : items.push(item);
    setSelectedItem(items);
  };

  /**
   * Component is used to display single item with title and cost
   * @param item:single ordered item
   * @returns {JSX.Element}
   * @constructor
   */
  const renderItem = ({item}) => {
    const index = selectedItem.findIndex(one => one.id === item.id);
    if (item && item.product['@ondc/org/cancellable']) {
      return (
        <View style={styles.itemContainer}>
          <Checkbox
            status={index > -1 ? 'checked' : 'unchecked'}
            onPress={() => onPressHandler(item, index)}
          />
          <View style={styles.container}>
            <Text style={[appStyles.container, styles.title]} numberOfLines={1}>
              {item.product?.descriptor?.name}
            </Text>
            <Text>QTY: {item.product?.quantity}</Text>
          </View>
          <Text style={styles.price}>₹{item.product?.price?.value}</Text>
        </View>
      );
    }
  };

  /**
   * function used to request tracking details of order
   * @returns {Promise<void>}
   */
  const updateOrder = async reason => {
    try {
      const items = selectedItem.map(element => {
        return {
          id: element.id,
          quantity: element.quantity,
          tags: {
            update_type: updateType,
            reason_code: reason.id,
            ttl_approval: 'PT24H',
            ttl_reverseqc: 'P3D',
            image: '',
          },
        };
      });
      const payload = [
        {
          context: {
            transaction_id: order.transactionId,
            bpp_id: order.bppId,
          },
          message: {
            update_target: 'item',
            order: {
              id: order._id,
              state: 'Delivered',
              provider: {
                id: order.provider.id,
              },
              items: items,
            },
          },
        },
      ];

      const {data} = await postData(`${BASE_URL}${UPDATE_ORDER}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data[0].message.ack.status === 'ACK') {
        setUpdateMessageId(data[0].context.message_id);
      }
    } catch (e) {
      console.log(e);
      handleApiError(e);
    }
  };

  const onConfirm = async () => {
    try {
      if (order.items.length === selectedItem.length) {
        await cancelOrder(
          setCancelInProgress,
          setCancelMessageId,
          order,
          selectedReason.id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        setUpdateInProgress(true);
        await updateOrder(selectedReason.reason);
      }
    } catch (err) {
      console.log(err);
      handleApiError(err);
      setUpdateInProgress(false);
    }
  };

  const onGoBack = () => setShowOverlay(false);

  const onSelect = reason => {
    closeMenu();
    setSelectedReason(reason);
  };

  return (
    <Dialog visible={showOverlay} style={styles.dialogContainer}>
      <Dialog.Title>Cancel Order</Dialog.Title>
      <View style={styles.dialogContent}>
        <FlatList
          data={productList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <Text>No items available for cancellation.</Text>
          )}
        />
        {selectedItem.length > 0 && (
          <>
            <Text>Reason</Text>
            <Menu
              contentStyle={styles.menu}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  style={[styles.dropdownButton, {borderColor: colors.primary}]}
                  onPress={openMenu}>
                  <Text style={{color: colors.primary}}>
                    {selectedReason
                      ? selectedReason?.reason
                      : 'Please select reason'}
                  </Text>
                </TouchableOpacity>
              }>
              {reasons.map(reason => (
                <TouchableOpacity style={styles.dropdownRow} onPress={() => onSelect(reason)}>
                  <Text>{reason.reason}</Text>
                </TouchableOpacity>
              ))}
            </Menu>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          contentStyle={appStyles.containedButtonContainer}
          labelStyle={appStyles.containedButtonLabel}
          mode="outlined"
          disabled={cancelInProgress || updateInProgress}
          onPress={onGoBack}>
          Go Back
        </Button>
        {selectedReason && (
          <Button
            contentStyle={appStyles.containedButtonContainer}
            labelStyle={appStyles.containedButtonLabel}
            mode={'contained'}
            loading={cancelInProgress || updateInProgress}
            onPress={onConfirm}>
            Confirm
          </Button>
        )}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'white',
  },
  dialogContent: {
    padding: 16,
  },
  container: {flexShrink: 1},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dropdownButton: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  price: {fontSize: 16, marginLeft: 10},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 16,
  },
  menu: {
    marginTop: 50,
    backgroundColor: 'white',
  },
  dropdownRow: {
    padding: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

export default withTheme(CancelDialog);
