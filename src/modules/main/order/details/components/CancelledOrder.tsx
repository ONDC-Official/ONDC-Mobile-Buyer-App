import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native-paper';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ProviderDetails from './ProviderDetails';
import ProductSummary from './ProductSummary';
import OrderMeta from './OrderMeta';
import {useAppTheme} from '../../../../../utils/theme';

const CancelledOrder = () => {
  const navigation = useNavigation<any>();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'#000'} />
        </TouchableOpacity>
        <Text variant={'titleLarge'} style={styles.orderDetailsTitle}>
          {orderDetails?.id}
        </Text>
      </View>
      <ScrollView style={styles.pageContainer}>
        <ProviderDetails
          provider={orderDetails?.provider}
          bppId={orderDetails?.bppId}
          domain={orderDetails?.domain}
          cancelled
          documents={orderDetails?.documents}
        />
        <ProductSummary
          items={orderDetails?.items}
          quote={orderDetails?.quote}
          fulfilment={null}
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    orderDetailsTitle: {
      color: colors.neutral400,
      marginLeft: 20,
    },
    orderStatus: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
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
  });

export default CancelledOrder;
