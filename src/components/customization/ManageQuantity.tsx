import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import React from 'react';
import {useAppTheme} from '../../utils/theme';
import useFormatNumber from '../../hooks/useFormatNumber';

interface ManageQuantity {
  cartItem: any;
  updatingCartItem: any;
  updateCartItem: (
    locationId: any,
    item: any,
    increment: boolean,
    uniqueId: any,
  ) => void;
  allowDelete?: boolean;
  deleteCartItem?: (itemId: any) => void;
}

const ManageQuantity: React.FC<ManageQuantity> = ({
  cartItem,
  updatingCartItem,
  updateCartItem,
  allowDelete = false,
  deleteCartItem = () => {},
}) => {
  const {formatNumber} = useFormatNumber();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const maximumQuantity = Number(
    cartItem?.item?.product?.quantity?.maximum.count,
  );

  return (
    <View style={styles.quantityContainer}>
      {allowDelete && cartItem?.item?.quantity?.count === 1 ? (
        <TouchableOpacity
          disabled={!!updatingCartItem || cartItem?.item?.quantity?.count === 0}
          style={styles.incrementButton}
          onPress={() => deleteCartItem(cartItem._id)}>
          <Icon name={'minus'} color={theme.colors.primary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={!!updatingCartItem || cartItem?.item?.quantity?.count === 0}
          style={styles.incrementButton}
          onPress={() =>
            updateCartItem(
              cartItem.item.location_details.id,
              cartItem.item.id,
              false,
              cartItem._id,
            )
          }>
          <Icon name={'minus'} color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      )}
      <Text variant={'bodyMedium'} style={styles.quantity}>
        {updatingCartItem === cartItem._id ? (
          <ActivityIndicator color={theme.colors.primary} size={14} />
        ) : (
          formatNumber(cartItem?.item?.quantity?.count)
        )}
      </Text>
      <TouchableOpacity
        disabled={!!updatingCartItem}
        style={styles.incrementButton}
        onPress={() =>
          updateCartItem(
            cartItem.item.location_details.id,
            cartItem.item.id,
            true,
            cartItem._id,
          )
        }>
        <Icon name={'plus'} color={theme.colors.primary} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    quantityContainer: {
      borderRadius: 8,
      borderColor: colors.neutral100,
      borderWidth: 1,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      width: 105,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    quantity: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
      color: colors.neutral400,
      marginHorizontal: 4,
    },
    incrementButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ManageQuantity;
