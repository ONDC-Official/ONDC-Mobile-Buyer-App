import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {CheckBox, Dialog, Text, withTheme} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContainButton from '../../../components/button/ContainButton';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {SERVER_URL, UPDATE_ORDER} from '../../../utils/apiUtilities';
import {reasons} from './reasons';
import {postData} from '../../../utils/api';
import {cancelOrder} from './OrderHistoryUtils';
import {useSelector} from 'react-redux';

const Overlay = ({
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
  const list = reasons.map(one => one.reason);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
        <View style={[appStyles.container, styles.itemContainer]}>
          <CheckBox
            containerStyle={[
              styles.containerStyle,
              {backgroundColor: colors.white},
            ]}
            checkedColor={colors.accentColor}
            checked={index > -1}
            onPress={() => onPressHandler(item, index)}
          />
          <View style={styles.container}>
            <Text style={[appStyles.container, styles.title]} numberOfLines={1}>
              {item.product?.descriptor?.name}
            </Text>
            <Text style={[styles.quantity, {color: colors.greyOutline}]}>
              QTY:{item.product?.quantity}
            </Text>
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

      const {data} = await postData(
        `${SERVER_URL}${UPDATE_ORDER}`,
        payload,
        options,
      );

      if (data[0].message.ack.status === 'ACK') {
        setUpdateMessageId(data[0].context.message_id);
      }
    } catch (e) {
      handleApiError(e);
    }
  };

  const onConfirm = async () => {
    try {
      const reason = reasons.find(element => element.reason === selectedReason);
      if (order.items.length === selectedItem.length) {
        await cancelOrder(
          setCancelInProgress,
          setCancelMessageId,
          order,
          reason.id,
          options,
        );
      } else {
        setUpdateInProgress(true);
        await updateOrder(reason);
      }
    } catch (err) {
      handleApiError(err);
      setUpdateInProgress(false);
    }
  };

  const onSelect = (item, index) => setSelectedReason(item);

  const onGoBack = () => setShowOverlay(false);

  const buttonStyles = Object.assign({}, styles.buttonStyle, {
    backgroundColor: colors.white,
    borderColor: colors.grey4,
  });

  const buttonTextStyles = Object.assign({}, styles.buttonTextStyle, {
    color: selectedReason ? colors.black : colors.grey4,
  });

  return (
    <Dialog isVisible={showOverlay} overlayStyle={styles.overlayStyle}>
      <Text style={styles.heading}>Cancel Order</Text>
      <FlatList
        data={productList}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text>No items available for cancellation.</Text>
        )}
      />
      {selectedItem.length > 0 && (
        <>
          <Text style={styles.heading}>Reason</Text>

          <SelectDropdown
            data={list}
            dropdownStyle={styles.dropdownStyle}
            buttonStyle={buttonStyles}
            buttonTextStyle={buttonTextStyles}
            renderDropdownIcon={() => <Icon name="menu-down" size={28} />}
            renderCustomizedRowChild={value => (
              <Text style={styles.label}>{value}</Text>
            )}
            defaultButtonText={
              selectedReason
                ? selectedReason
                : 'Please select reason to cancel '
            }
            onSelect={onSelect}
          />
        </>
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <ContainButton
            title={'Go Back'}
            backgroundColor={colors.greyOutline}
            color={colors.black}
            onPress={onGoBack}
          />
        </View>
        {selectedReason && (
          <>
            <View style={styles.space} />
            <View style={styles.button}>
              <ContainButton
                title={'Confirm'}
                loading={cancelInProgress || updateInProgress}
                onPress={onConfirm}
              />
            </View>
          </>
        )}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    borderRadius: 10,
    width: '93%',
    padding: 10,
    flexShrink: 1,
  },
  container: {flexShrink: 1},
  heading: {fontWeight: '700', fontSize: 18, marginBottom: 10},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  price: {fontSize: 16, marginLeft: 10},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  containerStyle: {
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 4,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  menu: {padding: 10, borderWidth: 1, borderRadius: 10, marginTop: 5},
  button: {width: 100},
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  space: {margin: 10},
  buttonStyle: {
    width: '100%',
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 10,
  },
  buttonTextStyle: {fontSize: 16, margin: 0},
  dropdownStyle: {borderRadius: 10},
  quantity: {fontWeight: '700'},
  label: {
    paddingHorizontal: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default withTheme(Overlay);
