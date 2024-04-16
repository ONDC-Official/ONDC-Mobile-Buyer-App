import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const ShippingDetails = ({fullfillmentId}: {fullfillmentId: string}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const fulfilmentIndex = orderDetails?.fulfillments.findIndex(
    (one: any) => one.id === fullfillmentId,
  );

  const fulfillmentHistory = orderDetails?.fulfillmentHistory.filter(
    (one: any) => one.id === fullfillmentId,
  );

  const fulfilment = orderDetails?.fulfillments[fulfilmentIndex];

  const items = useMemo(() => {
    return orderDetails?.items?.filter((obj: any) => {
      return obj?.tags?.some((tag: any) => {
        return (
          tag?.code === 'type' &&
          tag?.list?.some((item: any) => {
            return item.code === 'type' && item.value === 'item';
          })
        );
      });
    });
  }, [orderDetails?.items]);

  return (
    <View style={styles.shippingContainer}>
      <Text variant={'titleLarge'} style={styles.shippingTitle}>
        {t('Shipment Details.Shipment Details')} ({fulfilmentIndex + 1}/
        {orderDetails?.fulfillments.length})
      </Text>
      <Text variant={'bodyLarge'} style={styles.shippingTitle}>
        {t('Shipment Details.Items Arriving', {
          count: items?.length,
        })}
      </Text>
      <TouchableOpacity
        style={styles.accordion}
        onPress={() => setShowDetails(!showDetails)}>
        {orderDetails?.state !== 'Completed' ? (
          <View style={styles.accordionTitle}>
            <Text variant={'labelMedium'} style={styles.arrivalLabel}>
              {t('Shipment Details.Arriving On')}:
            </Text>
            <Text variant={'labelMedium'} style={styles.arrivalDate}>
              {moment(fulfilment?.end?.time?.range?.end).format('DD-MM-YYYY')}
            </Text>
          </View>
        ) : (
          <View style={styles.accordionTitle}>
            <Text variant={'labelMedium'} style={styles.arrivalLabel}>
              {t('Shipment Details.Delivered On')}:
            </Text>
            <Text variant={'labelMedium'} style={styles.arrivalDate}>
              {moment(orderDetails?.updatedAt).format('DD-MM-YYYY')}
            </Text>
          </View>
        )}
        <Icon
          name={showDetails ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={theme.colors.neutral400}
        />
      </TouchableOpacity>
      {showDetails &&
        fulfillmentHistory.map((history: any, index: number) => (
          <View key={history?._id} style={styles.statusContainer}>
            <View style={styles.status}>
              <View>
                <Icon
                  name={'check-circle'}
                  color={theme.colors.success600}
                  size={20}
                />
                {index < fulfillmentHistory.length - 1 && (
                  <View style={styles.link} />
                )}
              </View>
              <Text variant={'labelLarge'} style={styles.state}>
                {history?.state.replace(/-/g, ' ')}
              </Text>
            </View>
            <Text variant={'labelMedium'} style={styles.timestamp}>
              {moment(history?.createdAt).format('ddd, DD MMM hh:mm A')}
            </Text>
          </View>
        ))}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    shippingContainer: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      marginTop: 24,
      paddingBottom: 8,
    },
    shippingTitle: {
      marginBottom: 12,
      color: colors.neutral400,
    },
    accordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    arrivalLabel: {
      color: colors.neutral300,
    },
    arrivalDate: {
      color: colors.neutral400,
      marginLeft: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    status: {
      flexDirection: 'row',
    },
    link: {
      height: 28,
      borderLeftColor: colors.success600,
      borderLeftWidth: 2,
      marginLeft: 9,
    },
    state: {
      color: colors.neutral500,
      paddingTop: 3,
      paddingLeft: 8,
    },
    timestamp: {
      paddingTop: 4,
      color: colors.neutral300,
    },
  });

export default ShippingDetails;
