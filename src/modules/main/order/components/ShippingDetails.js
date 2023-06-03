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
import OrderStatus from './OrderStatus';
import {stringToDecimal} from '../../../../utils/utils';

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
        <View style={styles.orderStatus}>
          {order?.state && <OrderStatus status={order?.state} />}
        </View>
        <Divider />
        {order?.items?.map(product => (
          <Product key={product.id} item={product} theme={theme} />
        ))}
        {order?.quote?.breakup?.map(
          breakup =>
            breakup?.title === 'Delivery Charges' && (
              <View style={styles.priceContainer}>
                <Text
                  variant="titleSmall"
                  style={{color: theme.colors.opposite}}>
                  {breakup?.title}
                </Text>
                <Text
                  variant="titleSmall"
                  style={{color: theme.colors.opposite}}>
                  ₹ {stringToDecimal(breakup?.price?.value)}
                </Text>
              </View>
            ),
        )}
        {order.quote?.price?.value && (
          <>
            <View style={styles.priceContainer}>
              <Text variant="titleSmall" style={{color: theme.colors.opposite}}>
                Total Amount:
              </Text>
              <Text variant="titleSmall" style={{color: theme.colors.opposite}}>
                ₹
                {!isNaN(order.quote?.price?.value)
                  ? stringToDecimal(order.quote.price?.value)
                  : order.quote.price?.value}
              </Text>
            </View>
            <Divider />
          </>
        )}
        {shippingAddress ? (
          <Address
            title="Shipped To"
            name={shippingAddress?.name}
            email={contact?.email}
            phone={contact?.phone}
            address={shippingAddress}
          />
        ) : (
          <View style={styles.addressContainer}>
            <Text>Shipped To</Text>
            <Text>NA</Text>
          </View>
        )}
        <Divider />
        <Address
          title="Billed To"
          name={order?.billing?.name}
          email={order?.billing?.email}
          phone={order?.billing?.phone}
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
              items: order.items,
            })
          }>
          <Divider />
          <View style={[styles.rowContainer, styles.helpButton]}>
            <Text style={[{color: buttonColor}, styles.helpLabel]}>
              Support
            </Text>
            <Icon name="chevron-right" size={24} color={buttonColor} />
          </View>
        </TouchableOpacity>

        {order.state !== ORDER_STATUS.CANCELLED &&
          (order.state === ORDER_STATUS.DELIVERED || order.state === ORDER_STATUS.COMPLETED ? (
            <TouchableOpacity
              disabled={buttonDisabled}
              onPress={() =>
                navigation.navigate('CancelOrder', {
                  items: order.items,
                  bppId: order.bppId,
                  transactionId: order.transactionId,
                  orderId: order.id,
                  updateType: UPDATE_TYPE.RETURN,
                  updateId: order._id,
                  providerId: order.provider.id,
                  orderStatus: order.state,
                })
              }>
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
                    orderStatus: order.state,
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
              <TouchableOpacity
                disabled={buttonDisabled}
                onPress={() =>
                  navigation.navigate('RaiseComplaint', {
                    orderId: order.id,
                  })
                }>
                <Divider />
                <View style={[styles.rowContainer, styles.helpButton]}>
                  <Text style={[{color: buttonColor}, styles.helpLabel]}>
                    Raise Complaint
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
  orderStatus: {
    justifyContent: 'flex-end',
    padding: 12,
    flexDirection: 'row',
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
  addressContainer: {paddingHorizontal: 12, marginTop: 20, flexShrink: 1},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
});
