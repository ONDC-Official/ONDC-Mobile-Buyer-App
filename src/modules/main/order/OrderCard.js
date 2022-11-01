import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'react-native-elements';
import { appStyles } from '../../../styles/styles';

const ORDER_STATUS = {
  created: 'Created',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  updated: 'Updated',
  returned: 'Returned',
  replaced: 'Replaced',
  active: 'Active',
};

/**
 * Component to render single card on orders screen
 * @param theme:application theme
 * @param item:single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderCard = ({ item, theme }) => {
  const { colors } = theme;

  const { t } = useTranslation();

  const getOrderStatus = status => {
    const orderStatus = status ? status : null;
    switch (orderStatus) {
      case ORDER_STATUS.created:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.accentColor,
                backgroundColor: colors.statusBackground,
              },
            ]}>
            <Text style={{ color: colors.accentColor }}>
              {t('main.order.status.created')}
            </Text>
          </View>
        );

      case ORDER_STATUS.shipped:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.warning,
                backgroundColor: colors.shippedBackground,
              },
            ]}>
            <Text style={{ color: colors.white }}>
              {t('main.order.status.shipped')}
            </Text>
          </View>
        );

      case ORDER_STATUS.delivered:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.success,
                backgroundColor: colors.deliveredBackground,
              },
            ]}>
            <Text style={{ color: colors.white }}>
              {t('main.order.status.delivered')}
            </Text>
          </View>
        );

      case ORDER_STATUS.active:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.success,
                backgroundColor: colors.deliveredBackground,
              },
            ]}>
            <Text style={{ color: colors.white }}>
              {t('main.order.status.active')}
            </Text>
          </View>
        );

      case ORDER_STATUS.cancelled:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.error,
                backgroundColor: colors.cancelledBackground,
              },
            ]}>
            <Text style={{ color: colors.error }}>
              {t('main.order.status.cancelled')}
            </Text>
          </View>
        );

      case ORDER_STATUS.returned:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.error,
                backgroundColor: colors.cancelledBackground,
              },
            ]}>
            <Text style={{ color: colors.error }}>
              {t('main.order.status.returned')}
            </Text>
          </View>
        );

      case ORDER_STATUS.replaced:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.error,
                backgroundColor: colors.cancelledBackground,
              },
            ]}>
            <Text style={{ color: colors.error }}>
              {t(`main.order.status.${orderStatus}`)}
            </Text>
          </View>
        );

      case ORDER_STATUS.updated:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.warning,
                backgroundColor: colors.shippedBackground,
              },
            ]}>
            <Text style={{ color: colors.white }}>
              {t('main.order.status.updated')}
            </Text>
          </View>
        );

      default:
        return (
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.accentColor,
                backgroundColor: colors.statusBackground,
              },
            ]}>
            <Text style={{ color: colors.accentColor }}>
              {t('main.order.status.ordered')}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={appStyles.container}>
        <Text numberOfLines={1} style={styles.itemName}>
          {item.id ? item.id : t('main.order.na')}
        </Text>
        <Text style={{ color: colors.grey }}>
          {t('main.order.ordered_on_label')}
          {moment(item.createdAt).format('Do MMMM YYYY')}
        </Text>
      </View>
      {item.state && <>{getOrderStatus(item.state)}</>}
    </View>
  );
};

export default withTheme(OrderCard);

const styles = StyleSheet.create({
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: { fontSize: 16, fontWeight: 'bold' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
});
