import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../../../utils/theme';
import axios from 'axios';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, CART} from '../../../../../utils/apiActions';
import {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartItems} from '../../../../../toolkit/reducer/cart';
import {useIsFocused} from '@react-navigation/native';

const Close = require('../../../../../assets/dashboard/close.png');
const RightArrow = require('../../../../../assets/rightArrow.png');

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
  console.log('uid : ',uid)
  const source = useRef<any>(null);

  const [allCart, setAllCart] = useState<any>([]);

  const deleteStore = async (id: string) => {
    try {
      source.current = CancelToken.source();

      console.log(`${API_BASE_URL}${CART}/${uid}`);
      const {data} = await deleteDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/${id}/clear`,
        source.current.token,
      );
      getAllCartList()
        .then(() => {
          // setApiInProgress(false);
        })
        .catch(() => {
          // setApiInProgress(false);
        });
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
      setAllCart(data);
      dispatch(updateCartItems(data));
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
    navigation.navigate('SubCart',{index:index});
  };

  const renderItems = ({item, index}: any) => {
    console.log('item?._id :: ', item?._id);
    return (
      <View style={styles.mainItemView}>
        {/* header */}
        <View style={styles.itemHeader}>
          <View />
          <FastImage
            source={{
              uri: item?.product?.descriptor?.symbol,
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <View style={styles.titleView}>
              <Text variant="titleLarge" style={styles.title}>
                Willow Bakery
              </Text>
              <TouchableOpacity onPress={() => deleteStore(item?._id)}>
                <Image source={Close} />
              </TouchableOpacity>
            </View>
            <Text variant="labelMedium" style={styles.description}>
              Sec 28 Chd . 15 min . 7.5 Km
            </Text>
          </View>
        </View>

        {/* line */}
        <View style={styles.line}></View>

        {/* items */}
        <Text variant="labelMedium" style={styles.itemCart}>
          Items in cart {item?.items.length}
        </Text>

        <ScrollView
          contentContainerStyle={styles.itemMainView}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {item?.items.map((item: any) => {
            return (
              <View style={{}}>
                <FastImage
                  source={{
                    uri: item?.item?.product?.descriptor?.images[0],
                  }}
                  style={styles.headerImage}
                />
                <Text variant="labelMedium" style={styles.description}>
                  {item?.item?.product?.descriptor?.name.length < 4
                    ? item?.item?.product?.descriptor?.name.length
                    : `${item?.item?.product?.descriptor?.name.substring(
                        0,
                        4,
                      )}...`}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* bottomView */}
        <View style={styles.bottomView}>
          <Text variant="bodyLarge">Total: ₹400.00</Text>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => goToViewCart(index)}>
            <Text variant="labelLarge" style={styles.buttonText}>
              View Cart
            </Text>
            <Image source={RightArrow} />
          </TouchableOpacity>
        </View>
      </View>
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
    subContainer: {
      flexGrow: 1,
      padding: 16,
      gap: 16,
    },
    mainItemView: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      padding: 12,
    },
    itemHeader: {
      flexDirection: 'row',
    },
    headerImage: {
      height: 40,
      width: 40,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.neutral100,
    },
    headerText: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'space-between',
    },
    line: {height: 1, backgroundColor: colors.neutral100, marginVertical: 12},
    titleView: {
      flexDirection: 'row',
    },
    title: {
      flex: 1,
      color: colors.neutral400,
    },
    description: {
      color: colors.neutral300,
      paddingTop: 8,
    },
    itemCart: {
      color: colors.neutral400,
    },
    itemMainView: {
      flexDirection: 'row',
      paddingVertical: 8,
      gap: 8,
      overflow: 'hidden',
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
    },
    viewCartButton: {
      flexDirection: 'row',
      width: 97,
      height: 32,
      borderRadius: 21,
      padding: 8,
      backgroundColor: colors.primary,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonText: {
      color: colors.white,
    },
  });

export default DashboardCart;
