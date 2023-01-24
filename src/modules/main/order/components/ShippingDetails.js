import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Divider, Text, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {ORDER_STATUS, UPDATE_TYPE} from '../../../../utils/Constants';
import Address from './Address';
import useGetOrderStatus from './actions/useGetOrderStatus';
import useTrackOrder from './actions/useTrackOrder';
import Product from './Product';

/**
 * Component is used to display shipping details to the user when card is expanded
 * @param order:single order object
 * @param getOrderList:function to request order list
 * @param theme:application theme
 * @returns {JSX.Element}
 * @constructor
 */
const ShippingDetails = ({order, theme}) => {
  const navigation = useNavigation();
  const {colors} = theme;
  const {getStatus, statusInProgress} = useGetOrderStatus(
    order.bppId,
    order.transactionId,
    order.id,
  );
  const {trackOrder, trackInProgress} = useTrackOrder(
    order.bppId,
    order.transactionId,
    order.id,
  );

  const shippingAddress = order?.fulfillments[0]?.end?.location?.address;
  const contact = order?.fulfillments[0]?.end?.contact;

  const buttonDisabled = statusInProgress || trackInProgress;
  const buttonColor =
    statusInProgress || trackInProgress ? 'grey' : colors.primary;
  return (
    <ScrollView>
      <Card style={styles.card}>
        {order?.items?.map(product => (
          <Product key={product.id} item={product} />
        ))}
        <Address
          title="Shipped To"
          name={shippingAddress?.name}
          email={contact?.email}
          phone={contact?.phone}
          address={shippingAddress}
        />
        <Divider />
        <Address
          title="Billed To"
          name={shippingAddress?.name}
          email={contact?.email}
          phone={contact?.phone}
          address={order?.billing?.address}
        />
      </Card>

      <Card style={styles.card}>
        <View style={styles.helpContainer}>
          <Text variant="titleMedium">Need help with your item?</Text>
        </View>

        <TouchableOpacity
          disabled={buttonDisabled}
          onPress={() =>
            navigation.navigate('CallSeller', {
              bppId: order.bppId,
              transactionId: order.transactionId,
              orderId: order.id,
            })
          }>
          <Divider />
          <View style={[styles.rowContainer, styles.helpButton]}>
            <Text style={[{color: buttonColor}, styles.helpLabel]}>Call</Text>
            <Icon name="chevron-right" size={24} color={buttonColor} />
          </View>
        </TouchableOpacity>

        {order.state !== ORDER_STATUS.CANCELLED &&
          (order.state === ORDER_STATUS.DELIVERED ? (
            <TouchableOpacity disabled={buttonDisabled}>
              <Divider />
              <View style={[styles.rowContainer, styles.helpButton]}>
                <Text style={[{color: buttonColor}, styles.helpLabel]}>
                  Return items
                </Text>
                <Icon name="chevron-right" size={24} color={buttonColor} />
              </View>
            </TouchableOpacity>
          ) : (
            <>
              {!!order.id && (
                <TouchableOpacity onPress={getStatus} disabled={buttonDisabled}>
                  <Divider />
                  <View style={[styles.rowContainer, styles.helpButton]}>
                    <Text style={[{color: buttonColor}, styles.helpLabel]}>
                      Get Order Status
                    </Text>
                    {statusInProgress ? (
                      <ActivityIndicator size={24} color={colors.primary} />
                    ) : (
                      <Icon
                        name="chevron-right"
                        size={24}
                        color={buttonColor}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={trackOrder} disabled={buttonDisabled}>
                <Divider />
                <View style={[styles.rowContainer, styles.helpButton]}>
                  <Text style={[{color: buttonColor}, styles.helpLabel]}>
                    Track Order
                  </Text>
                  {trackInProgress ? (
                    <ActivityIndicator size={24} color={colors.primary} />
                  ) : (
                    <Icon name="chevron-right" size={24} color={buttonColor} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={buttonDisabled}
                onPress={() =>
                  navigation.navigate('CancelOrder', {
                    items: order.items,
                    bppId: order.bppId,
                    transactionId: order.transactionId,
                    orderId: order.id,
                    updateType: UPDATE_TYPE.CANCEL,
                    updateId: order._id,
                    providerId: order.provider.id,
                  })
                }>
                <Divider />
                <View style={[styles.rowContainer, styles.helpButton]}>
                  <Text style={[{color: buttonColor}, styles.helpLabel]}>
                    Cancel Items
                  </Text>
                  <Icon name="chevron-right" size={24} color={buttonColor} />
                </View>
              </TouchableOpacity>
            </>
          ))}
      </Card>
    </ScrollView>
  );
};

export default withTheme(ShippingDetails);

const styles = StyleSheet.create({
  card: {
    margin: 8,
    backgroundColor: 'white',
  },
  actionContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  helpContainer: {
    padding: 8,
  },
  container: {
    paddingTop: 8,
  },
  rowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  helpLabel: {
    fontSize: 18,
  },
  priceContainer: {
    marginTop: 10,
  },
  name: {fontSize: 18, fontWeight: '500', marginVertical: 4, flexShrink: 1},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, marginLeft: 10},
  address: {marginBottom: 4},
  quantity: {fontWeight: '700'},
});
