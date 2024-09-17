import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const PaymentMethods = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({order}) => order);

  const {location, contact} = orderDetails?.fulfillments[0]?.end;

  return (
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={20} color={theme.colors.neutral400} />
        </TouchableOpacity>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {t('Address WishList.Delivery Address')}
        </Text>
      </View>
      <View style={styles.pageContent}>
        <View style={styles.container}>
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Address WishList.Delivery Address')}
          </Text>
          {!!location?.address?.name && (
            <Text variant={'bodyLarge'} style={styles.name}>
              {location?.address?.name}
            </Text>
          )}
          <Text variant={'bodySmall'} style={styles.normalText}>
            {contact?.email} {contact?.phone}
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {location?.address?.locality}, {location?.address?.building},{' '}
            {location?.address?.city}, {location?.address?.state},{' '}
            {location?.address?.country} - {location?.address?.area_code}
          </Text>
        </View>

        <View style={styles.container}>
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Profile.Payment Methods')}
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {orderDetails?.payment?.type === 'ON-FULFILLMENT'
              ? t('Payment Methods.Cash On Delivery')
              : t('Payment Methods.Prepaid')}
          </Text>
          <Divider style={styles.divider} />
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Payment Methods.Billed Address')}
          </Text>
          {!!orderDetails?.billing?.name && (
            <Text variant={'bodyLarge'} style={styles.name}>
              {orderDetails?.billing?.name}
            </Text>
          )}
          <Text variant={'bodySmall'} style={styles.normalText}>
            {orderDetails?.billing?.email}, {orderDetails?.billing?.phone}
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {orderDetails?.billing?.address?.locality},{' '}
            {orderDetails?.billing?.address?.building},{' '}
            {orderDetails?.billing?.address?.city},{' '}
            {orderDetails?.billing?.address?.state},{' '}
            {orderDetails?.billing?.address?.country} -{' '}
            {orderDetails?.billing?.address?.areaCode}
          </Text>
        </View>

        <View style={styles.container}>
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Payment Methods.Customer Details')}
          </Text>
          <View style={styles.customerDetails}>
            <Text variant={'bodyLarge'} style={styles.name}>
              {t('Payment Methods.Order Number')}
            </Text>
            <Text variant={'bodySmall'} style={styles.normalText}>
              {orderDetails?.id}
            </Text>
          </View>
          <View style={styles.customerDetails}>
            <Text variant={'bodyLarge'} style={styles.name}>
              {t('Payment Methods.Customer Name')}
            </Text>
            <Text variant={'bodySmall'} style={styles.normalText}>
              {orderDetails?.billing?.name}
            </Text>
          </View>
          <Text variant={'bodyLarge'} style={styles.name}>
            {t('Payment Methods.Phone Number')}
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {orderDetails?.billing?.phone}
          </Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    pageTitle: {
      marginLeft: 20,
      color: colors.neutral400,
    },
    pageContent: {
      backgroundColor: colors.neutral50,
      padding: 16,
      flex: 1,
    },
    container: {
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral100,
      padding: 16,
      marginBottom: 12,
    },
    title: {
      marginBottom: 12,
      color: colors.neutral400,
    },
    divider: {
      marginVertical: 12,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 4,
    },
    normalText: {
      color: colors.neutral300,
      marginBottom: 4,
    },
    customerDetails: {
      marginBottom: 12,
    },
  });

export default PaymentMethods;
