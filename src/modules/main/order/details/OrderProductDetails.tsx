import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ProviderDetails from './components/ProviderDetails';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import ShippingDetails from './components/ShippingDetails';
import ProductSummary from './components/ProductSummary';
import OrderMeta from './components/OrderMeta';
import {useAppTheme} from '../../../../utils/theme';

const OrderProductDetails = ({route: {params}}: {route: any}) => {
  const navigation = useNavigation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={colors.neutral400} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text variant={'titleLarge'} style={styles.orderDetailsTitle}>
            {orderDetails?.id}
          </Text>
          <Text variant={'labelSmall'} style={styles.orderStatus}>
            {orderDetails?.state} -{' '}
            {CURRENCY_SYMBOLS[orderDetails?.payment?.params?.currency]}
            {orderDetails?.payment?.params?.amount}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.pageContainer}>
        <ProviderDetails
          provider={orderDetails?.provider}
          bppId={orderDetails?.bppId}
          domain={orderDetails?.domain}
        />
        <ShippingDetails fullfillmentId={params.fulfillmentId} />
        <ProductSummary
          items={orderDetails?.items.filter(
            (one: any) => one.fulfillment_id === params.fulfillmentId,
          )}
          quote={orderDetails?.quote}
          fulfilment={orderDetails.fulfillments.find(
            (one: any) => one.id === params.fulfillmentId,
          )}
        />
        <OrderMeta />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    orderDetails: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitleContainer: {
      marginLeft: 20,
    },
    orderDetailsTitle: {
      color: colors.neutral400,
      marginBottom: 2,
    },
    fulfilmentDetails: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
    orderStatus: {
      color: colors.neutral300,
    },
    empty: {
      width: 24,
      height: 24,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
    },
    creationHeader: {
      flexDirection: 'row',
      marginVertical: 22,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderId: {
      color: colors.neutral300,
    },
    creationDate: {
      marginLeft: 8,
      color: colors.neutral300,
    },
    shippingContainer: {
      paddingTop: 24,
      paddingHorizontal: 16,
    },
    shippingTitle: {
      marginBottom: 12,
      fontWeight: '600',
    },
    accordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrivalLabel: {
      color: colors.neutral300,
    },
    arrivalDate: {
      color: colors.neutral400,
      marginLeft: 8,
    },
  });

export default OrderProductDetails;
