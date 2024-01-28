import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const ReturnOrderButton = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails, requestingStatus, requestingTracker} = useSelector(
    ({orderReducer}) => orderReducer,
  );

  const navigateToCancelOrder = () => navigation.navigate('ReturnOrder');

  const returnableProducts = orderDetails?.items.filter(
    (one: any) => one?.product['@ondc/org/returnable'],
  );

  if (orderDetails?.state === 'Completed' && returnableProducts.length > 0) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={navigateToCancelOrder}
        disabled={requestingStatus || requestingTracker}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Return Order
        </Text>
      </TouchableOpacity>
    );
  }

  return <></>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderColor: colors.primary,
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      marginTop: 24,
      marginHorizontal: 16,
      marginBottom: 20,
    },
    label: {
      color: colors.primary,
    },
  });

export default ReturnOrderButton;
