import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';

interface ManageQuantity {
  cartItem: any;
  updatingCartItem: any;
  updateCartItem: (item: any, increment: boolean, uniqueId: any) => void;
}

const ManageQuantity: React.FC<ManageQuantity> = ({
  cartItem,
  updatingCartItem,
  updateCartItem,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const maximumQuantity = Number(
    cartItem?.item?.product?.quantity?.maximum.count,
  );
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        disabled={!!updatingCartItem || cartItem?.item?.quantity?.count === 0}
        style={styles.incrementButton}
        onPress={() => updateCartItem(cartItem.item.id, false, cartItem._id)}>
        <Icon name={'minus'} color={theme.colors.primary} />
      </TouchableOpacity>
      <Text variant={'bodyMedium'} style={styles.quantity}>
        {updatingCartItem === cartItem._id ? (
          <ActivityIndicator color={theme.colors.primary} size={14} />
        ) : (
          cartItem?.item?.quantity?.count
        )}
      </Text>
      <TouchableOpacity
        disabled={
          !!updatingCartItem ||
          maximumQuantity === cartItem?.item?.quantity?.count
        }
        style={styles.incrementButton}
        onPress={() => updateCartItem(cartItem.item.id, true, cartItem._id)}>
        <Icon name={'plus'} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    quantityContainer: {
      borderRadius: 6,
      borderColor: '#E8E8E8',
      borderWidth: 1,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      height: 26,
      alignItems: 'center',
      marginRight: 18,
      width: 70,
    },
    quantity: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
    },
    incrementButton: {
      paddingHorizontal: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ManageQuantity;
