import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useAppTheme} from '../../../../../utils/theme';

const CancelOrderButton = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails, requestingStatus, requestingTracker} = useSelector(
    ({order}) => order,
  );

  const navigateToCancelOrder = () =>
    navigation.navigate('CancelOrder', {
      domain: orderDetails.domain,
      bppId: orderDetails.bppId,
      bppUrl: orderDetails.bpp_uri,
      transactionId: orderDetails.transactionId,
      orderId: orderDetails?.id,
    });

  const allCancellable = orderDetails?.items.every(
    (item: any) => item.product['@ondc/org/cancellable'],
  );

  if (
    (orderDetails?.state === 'Accepted' || orderDetails?.state === 'Created') &&
    allCancellable
  ) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={navigateToCancelOrder}
        disabled={requestingStatus || requestingTracker}>
        <Text variant={'bodyMedium'} style={styles.label}>
          {t('Cancel Order.Cancel Order')}
        </Text>
      </TouchableOpacity>
    );
  }

  return <></>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderColor: colors.error600,
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      marginTop: 24,
      marginBottom: 20,
    },
    label: {
      color: colors.error600,
    },
  });

export default CancelOrderButton;
