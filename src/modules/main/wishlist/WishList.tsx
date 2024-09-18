import {ActivityIndicator} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/header/HeaderWithActions';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import {useAppTheme} from '../../../utils/theme';
import {keyExtractor} from '../../../utils/utils';
import {useEffect, useRef, useState} from 'react';
import WishlistItem from './components/WishlistItem';
import {useIsFocused} from '@react-navigation/native';
import {API_BASE_URL, WISHLIST} from '../../../utils/apiActions';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import axios from 'axios';
import {useSelector} from 'react-redux';
import EmptyCart from './components/EmptyCart';

const CancelToken = axios.CancelToken;

const WishList = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const {handleApiError} = useNetworkErrorHandling();
  const {getDataWithAuth, deleteDataWithAuth} = useNetworkHandling();
  const {uid} = useSelector(({auth}) => auth);

  const [wishlistData, setWishlistData] = useState<any>([]);
  const [apiInProgress, setApiInProgress] = useState<boolean>(true);

  const deleteWishlist = async (id: string) => {
    try {
      source.current = CancelToken.source();

      await deleteDataWithAuth(
        `${API_BASE_URL}${WISHLIST}/${uid}/${id}/clear`,
        source.current.token,
      );
      const response = wishlistData.filter((item: any) => {
        if (item._id !== id) {
          return item;
        }
      });

      setWishlistData(response);
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

  const getWishList = async () => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${WISHLIST}/${uid}/all`,
        source.current.token,
      );
      const response = data.filter((item: any) => {
        if (item.items.length > 0) {
          return item;
        } else {
          deleteWishlist(item?._id);
        }
      });
      setWishlistData(response);
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
      getWishList()
        .then(() => {
          setApiInProgress(false);
        })
        .catch(() => {
          setApiInProgress(false);
        });
    }
  }, [isFocused]);

  const renderItems = ({item, index}: any) => {
    return <WishlistItem item={item} deleteWishlist={deleteWishlist} />;
  };

  return (
    <SafeAreaPage>
      <View style={styles.container}>
        <Header label={t('WishList.Wishlist')} cart={true} />
        {apiInProgress && wishlistData.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </View>
        ) : wishlistData.length > 0 ? (
          <FlatList
            keyExtractor={keyExtractor}
            data={wishlistData}
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

export default WishList;
