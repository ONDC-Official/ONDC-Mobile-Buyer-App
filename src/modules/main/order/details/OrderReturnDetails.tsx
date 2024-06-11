import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ProviderDetails from './components/ProviderDetails';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import OrderMeta from './components/OrderMeta';
import ReturnDetails from './components/ReturnDetails';
import ReturnSummary from './components/ReturnSummary';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';

const OrderReturnDetails = ({route: {params}}: {route: any}) => {
  const {formatNumber} = useFormatNumber();
  const navigation = useNavigation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'#000'} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text variant={'titleSmall'} style={styles.orderDetailsTitle}>
            {orderDetails?.id}
          </Text>
          <Text variant={'labelMedium'} style={styles.orderStatus}>
            {orderDetails?.state} -{' '}
            {CURRENCY_SYMBOLS[orderDetails?.payment?.params?.currency]}
            {formatNumber(orderDetails?.payment?.params?.amount)}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.pageContainer}>
        <ProviderDetails
          provider={orderDetails?.provider}
          bppId={orderDetails?.bppId}
          domain={orderDetails?.domain}
        />
        <ReturnDetails fulfilmentId={params.fulfillmentId} />
        <ReturnSummary fulfilmentId={params.fulfillmentId} />
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
    orderStatus: {
      color: colors.neutral300,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
    },
  });

export default OrderReturnDetails;
