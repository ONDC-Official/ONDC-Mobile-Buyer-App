import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

import {useAppTheme} from '../../../../utils/theme';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, CART} from '../../../../utils/apiActions';
import {updateCartItems} from '../../../../toolkit/reducer/cart';
import StoreCart from './components/StoreCart';
import EmptyCart from '../provider/components/EmptyCart';
import {keyExtractor} from '../../../../utils/utils';
import SafeAreaPage from '../../../../components/page/SafeAreaPage';
import Header from '../../../../components/header/HeaderWithActions';

const CancelToken = axios.CancelToken;

const Cart = ({navigation}: any) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth, deleteDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {uid} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);

  const [apiInProgress, setApiInProgress] = useState<boolean>(true);
  const [allCart, setAllCart] = useState<any>([]);

  const deleteStore = async (id: string) => {
    try {
      source.current = CancelToken.source();

      await deleteDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/${id}/clear`,
        source.current.token,
      );
      const response = allCart.filter((item: any) => {
        if (item._id !== id) {
          return item;
        }
      });

      setAllCart(response);
      dispatch(updateCartItems(response));
    } catch (error: any) {
      if (error.response) {
        if (error.response.status !== 404) {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  const getAllCartList = async () => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/all`,
        source.current.token,
      );
      const response = data.filter((item: any) => {
        if (item.items.length > 0) {
          return item;
        } else {
          deleteStore(item?._id);
        }
      });

      setAllCart(response);
      dispatch(updateCartItems(response));
    } catch (error: any) {
      if (error.response) {
        if (error.response.status !== 404) {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAllCartList()
        .then(() => {
          setApiInProgress(false);
        })
        .catch(() => {
          setApiInProgress(false);
        });
    }
  }, [isFocused]);

  const goToViewCart = (index: number) => {
    navigation.navigate('ProviderCart', {index: index});
  };

  const renderItems = ({item, index}: any) => {
    return (
      <StoreCart
        item={item}
        index={index}
        deleteStore={deleteStore}
        goToViewCart={goToViewCart}
      />
    );
  };

  return (
    <SafeAreaPage>
      <View style={styles.container}>
        <Header label={t('Cart.All Cart')} />
        {apiInProgress && allCart.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </View>
        ) : allCart.length > 0 ? (
          <FlatList
            keyExtractor={keyExtractor}
            data={allCart}
            renderItem={renderItems}
            contentContainerStyle={styles.subContainer}
          />
        ) : (
          <EmptyCart />
        )}
      </View>
    </SafeAreaPage>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      padding: 16,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    emptyText: {
      flex: 1,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    subContainer: {
      flexGrow: 1,
      paddingHorizontal: 16,
      gap: 15,
      paddingVertical: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Cart;
