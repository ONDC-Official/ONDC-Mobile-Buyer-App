import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Button, Modal, Portal, Text} from 'react-native-paper';

import Login from '../modules/authentication/login/Login';
import SignUp from '../modules/authentication/signUp/SignUp';
import Splash from '../modules/authentication/splash/Splash';
import AddDefaultAddress from '../modules/main/profile/AddDefaultAddress';
import Dashboard from '../modules/main/dashboard/Dashboard';
import AddressList from '../modules/main/dashboard/components/address/AddressList';
import SubCart from '../modules/main/cart/SubCart';
import ProductDetails from '../modules/main/product/details/ProductDetails';
import Profile from '../modules/main/profile/Profile';
import OrderDetails from '../modules/main/order/details/OrderDetails';
import UpdateAddress from '../modules/main/dashboard/components/address/UpdateAddress';
import CategoryDetails from '../modules/main/category/CategoryDetails';
import CouponList from '../modules/main/category/CouponList';
import BrandDetails from '../modules/main/provider/BrandDetails';
import InvalidBrandDetails from '../modules/main/provider/InvalidBrandDetails';
import SubCategoryDetails from '../modules/main/subCategory/SubCategoryDetails';
import Outlets from '../modules/main/provider/Outlets';
import ChooseLanguage from '../modules/main/profile/ChooseLanguage';
import CancelOrder from '../modules/main/order/details/CancelOrder';
import SearchProducts from '../modules/main/dashboard/SearchProducts';
import PaymentMethods from '../modules/main/order/details/PaymentMethods';
import OrderProductDetails from '../modules/main/order/details/OrderProductDetails';
import ReturnItem from '../modules/main/order/details/ReturnItem';
import Complaints from '../modules/main/complaint/list/Complaints';
import ComplaintDetails from '../modules/main/complaint/details/ComplaintDetails';
import OrderReturnDetails from '../modules/main/order/details/OrderReturnDetails';
import ForgotPassword from '../modules/authentication/forgotPassword/ForgotPassword';
import StoresNearMe from '../modules/main/stores/StoresNearMe';
import ShopByCategory from '../modules/main/category/ShopByCategory';
import {theme} from '../utils/theme';
import FeaturedCategories from '../modules/main/category/FeaturedCategories';
import SellerQRCode from '../modules/main/dashboard/SellerQRCode';
import {getUrlParams, isDomainSupported, isValidQRURL} from '../utils/utils';
import {SUPPORT_EMAIL} from '../utils/constants';
import InvalidBarcode from '../assets/invalid_barcode.svg';
import useNetworkHandling from '../hooks/useNetworkHandling';
import {API_BASE_URL, SERVICEABLE_LOCATIONS} from '../utils/apiActions';
import Orders from '../modules/main/order/list/Orders';
import List from '../modules/main/dashboard/components/tabs/List';
import DashboardCart from '../modules/main/dashboard/components/tabs/Cart';
import StoreInfo from '../modules/main/provider/StoreInfo'

const Stack = createStackNavigator();

const headerStyle = {
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowColor: 'black',
  shadowOpacity: 1,
  shadowRadius: 3.84,
  elevation: 15,
};

/**
 * Component for stack navigation
 * @returns {JSX.Element}
 * @constructor
 */
const AppNavigation = () => {
  const navigationRef = useRef<any>(null);
  const {token} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);
  const {address} = useSelector((state: any) => state.address);
  const {t} = useTranslation();
  const {getDataWithToken} = useNetworkHandling();
  const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);
  const [linkMessage, setLinkMessage] = useState<string>('');

  const hideLinkModal = useCallback(() => {
    setLinkModalVisible(false);
  }, []);

  const showLinkMessage = (message: string) => {
    setLinkMessage(message);
    setLinkModalVisible(true);
  };

  const handleDeepLink = useCallback(
    (url: string, userToken: string, userAddress: any) => {
      if (url.startsWith('beckn://ondc')) {
        const urlParams = getUrlParams(url);
        if (isValidQRURL(urlParams)) {
          if (isDomainSupported(urlParams['context.domain'])) {
            const brandId = `${urlParams['context.bpp_id']}_${urlParams['context.domain']}_${urlParams['message.intent.provider.id']}`;
            const pageParams: any = {brandId};
            if (
              urlParams.hasOwnProperty('message.intent.provider.locations.0.id')
            ) {
              pageParams.outletId = `${brandId}_${urlParams['message.intent.provider.locations.0.id']}`;
              navigationRef.current.navigate('BrandDetails', pageParams);
            } else {
              source.current = axios.CancelToken.source();
              const {lat, lng, areaCode} = userAddress?.address;
              getDataWithToken(
                `${API_BASE_URL}${SERVICEABLE_LOCATIONS}?providerId=${brandId}&latitude=${lat}&longitude=${lng}&pincode=${areaCode}`,
                userToken,
                source.current.token,
              ).then(locationDetails => {
                if (locationDetails.data.data.length > 0) {
                  pageParams.outletId = locationDetails.data.data[0].id;
                  navigationRef.current.navigate('BrandDetails', pageParams);
                } else {
                  showLinkMessage(
                    t(
                      'Provider Details.This store does not service your location',
                    ),
                  );
                }
              });
            }
          } else {
            showLinkMessage(
              t(
                'Provider Details.This store/seller type is not supported by Saarthi Application, explore other buyer apps.',
              ),
            );
          }
        } else {
          showLinkMessage(
            t(
              'Provider Details.Incorrect specifications or malformed request',
              {
                email: SUPPORT_EMAIL,
              },
            ),
          );
        }
      } else {
        showLinkMessage(
          t('Provider Details.Incorrect specifications or malformed request', {
            email: SUPPORT_EMAIL,
          }),
        );
      }
    },
    [navigationRef, getDataWithToken, t],
  );

  useEffect(() => {
    const getUrlDetails = ({url}: {url: string}) => {
      if (url) {
        if (token) {
          if (address) {
            handleDeepLink(url, token, address);
          } else {
            showLinkMessage(t('Global.Please set your preferences'));
          }
        } else {
          showLinkMessage(
            t('Global.Please log in to your account and set your preferences'),
          );
        }
      }
    };

    Linking.addEventListener('url', getUrlDetails);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [handleDeepLink, token, address, t]);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
          }}>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
            initialParams={{handleDeepLink}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubCart"
            component={SubCart}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddDefaultAddress"
            component={AddDefaultAddress}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpdateAddress"
            component={UpdateAddress}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="AddressList"
            component={AddressList}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="MyProfile"
            component={Profile}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ChooseLanguage"
            component={ChooseLanguage}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Complaints"
            component={Complaints}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ComplaintDetails"
            component={ComplaintDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="List"
            component={List}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="DashboardCart"
            component={DashboardCart}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="OrderProductDetails"
            component={OrderProductDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="OrderReturnDetails"
            component={OrderReturnDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CouponList"
            component={CouponList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubCategoryDetails"
            component={SubCategoryDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CancelOrder"
            component={CancelOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReturnItem"
            component={ReturnItem}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethods}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BrandDetails"
            component={BrandDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InvalidBrandDetails"
            component={InvalidBrandDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Outlets"
            component={Outlets}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchProducts"
            component={SearchProducts}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoresNearMe"
            component={StoresNearMe}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ShopByCategory"
            component={ShopByCategory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FeaturedCategories"
            component={FeaturedCategories}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SellerQRCode"
            component={SellerQRCode}
            options={{headerShown: false}}
            initialParams={{handleDeepLink}}
          />
          <Stack.Screen
            name="StoreInfo"
            component={StoreInfo}
            options={{headerShown: false}}
            initialParams={{handleDeepLink}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Portal>
        <Modal visible={linkModalVisible} onDismiss={hideLinkModal}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={hideLinkModal}>
              <Icon name={'clear'} size={20} color={'#000'} />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalContainer}>
                <InvalidBarcode width={100} height={100} />
                <Text variant={'bodySmall'} style={styles.message}>
                  {linkMessage}
                </Text>
              </View>
              <Button mode={'contained'} onPress={hideLinkModal}>
                {t('Cart.Reference.ok')}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  searchButton: {
    marginRight: 16,
  },

  modal: {
    backgroundColor: theme.colors.white,
    margin: 20,
    borderRadius: 24,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  message: {
    color: theme.colors.neutral400,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
});

export default AppNavigation;
