import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../../../utils/theme';
import axios from 'axios';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, CART} from '../../../../../utils/apiActions';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartItems} from '../../../../../toolkit/reducer/cart';
import {useIsFocused} from '@react-navigation/native';
import StoreCart from '../../../cart/StoreCart';

const CancelToken = axios.CancelToken;

const DashboardCart = ({navigation}: any) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth, deleteDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {uid} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);

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
        if (error.response.status === 404) {
        } else {
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
        if (error.response.status === 404) {
        } else {
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
          // setApiInProgress(false);
        })
        .catch(() => {
          // setApiInProgress(false);
        });
    }
  }, [isFocused]);

  const goToViewCart = (index: number) => {
    navigation.navigate('SubCart', {index: index});
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          All Cart
        </Text>
      </View>
      <FlatList
        data={allCart}
        renderItem={renderItems}
        contentContainerStyle={styles.subContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Store Items not found</Text>
        )}
      />
    </View>
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
      padding: 16,
      gap: 16,
    },
  });

export default DashboardCart;
