import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import DownloadIcon from '../../../../../assets/download.svg';
import ProviderDetails from './ProviderDetails';
import ProductSummary from './ProductSummary';
import OrderMeta from './OrderMeta';

const CancelledOrder = ({orderDetails}: {orderDetails: any}) => {
  const navigation = useNavigation<any>();
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'#000'} />
        </TouchableOpacity>
        <Text variant={'titleSmall'} style={styles.orderDetailsTitle}>
          {orderDetails?.id}
        </Text>
      </View>
      <ScrollView style={styles.pageContainer}>
        <View style={styles.orderIdContainer}>
          {!!orderDetails?.documents && (
            <TouchableOpacity
              onPress={() => Linking.openURL(orderDetails?.documents[0]?.url)}>
              <DownloadIcon width={24} height={24} />
            </TouchableOpacity>
          )}
        </View>
        <ProviderDetails provider={orderDetails?.provider} cancelled />
        <ProductSummary
          items={orderDetails?.items}
          quote={orderDetails?.quote}
          cancelled
          documents={orderDetails?.documents}
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
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    orderDetailsTitle: {
      color: '#1A1A1A',
      marginLeft: 20,
    },
    orderStatus: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: '#FAFAFA',
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
      color: '#686868',
    },
    creationDate: {
      marginLeft: 8,
      color: '#686868',
    },
  });

export default CancelledOrder;
