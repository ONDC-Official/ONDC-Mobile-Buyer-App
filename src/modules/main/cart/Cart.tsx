import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  useTheme,
} from 'react-native-paper';
import React, {useEffect} from 'react';

import {getPriceWithCustomisations} from '../../../utils/utils';
import CartItems from './components/CartItems';
import useSelectItems from '../../../hooks/useSelectItems';
import EmptyCart from './components/EmptyCart';

const Cart = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {
    loading,
    cartItems,
    checkoutLoading,
    getCartItems,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    setCartItems,
  } = useSelectItems(true);

  const getCartSubtotal = () => {
    let subtotal = 0;
    cartItems.map((cartItem: any) => {
      if (cartItem.item.hasCustomisations) {
        subtotal +=
          getPriceWithCustomisations(cartItem) *
          cartItem?.item?.quantity?.count;
      } else {
        subtotal +=
          cartItem?.item?.product?.subtotal * cartItem?.item?.quantity?.count;
      }
    });
    return subtotal;
  };

  useEffect(() => {
    getCartItems().then(() => {});
  }, []);

  return (
    <View style={styles.pageContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <CartItems
                cartItems={cartItems}
                setCartItems={setCartItems}
                haveDistinctProviders={haveDistinctProviders}
                isProductCategoryIsDifferent={isProductCategoryIsDifferent}
              />
              <Card style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text variant={'bodyMedium'}>Order Total</Text>
                  <Text variant={'titleMedium'}>₹{getCartSubtotal()}</Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.buyButton}
                  disabled={
                    isProductAvailableQuantityIsZero ||
                    isProductCategoryIsDifferent ||
                    haveDistinctProviders ||
                    checkoutLoading
                  }
                  icon={() =>
                    checkoutLoading ? (
                      <ActivityIndicator
                        size={14}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <></>
                    )
                  }
                  onPress={onCheckoutFromCart}>
                  Checkout
                </Button>
              </Card>
            </>
          )}
        </>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: '#F9F9F9',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryCard: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      backgroundColor: '#fff',
      elevation: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buyButton: {
      marginTop: 16,
    },
  });

export default Cart;
