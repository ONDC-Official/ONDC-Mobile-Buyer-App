import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import Address from '../../dashboard/components/address/Address';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, DELIVERY_ADDRESS} from '../../../../utils/apiActions';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {skeletonList} from '../../../../utils/utils';
import {appStyles} from '../../../../styles/styles';
import AddressSkeleton from '../../dashboard/components/address/AddressSkeleton';
import {useAppTheme} from '../../../../utils/theme';
import {setStoredData} from '../../../../utils/storage';
import {setAddress} from '../../../../toolkit/reducer/address';

interface AddressList {
  detectAddressNavigation: () => void;
  deliveryAddress: any;
  setDeliveryAddress: (newAddress: any) => void;
}

const CancelToken = axios.CancelToken;

const AddressList: React.FC<AddressList> = ({
  detectAddressNavigation,
  deliveryAddress,
  setDeliveryAddress,
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<any[]>([]);

  const updateDeliveryAddress = async (newAddress: any) => {
    await setStoredData('address', JSON.stringify(newAddress));
    dispatch(setAddress(newAddress));
    setDeliveryAddress(Object.assign({}, newAddress));
  };

  /**
   * function to get list of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      setApiInProgress(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${DELIVERY_ADDRESS}`,
        source.current.token,
      );
      setAddresses(data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setAddresses([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    } finally {
      setApiInProgress(false);
    }
  };

  const navigateToAddAddress = () => {
    navigation.navigate('AddDefaultAddress', {setDefaultAddress: false});
    detectAddressNavigation();
  };

  useEffect(() => {
    if (isFocused) {
      getAddressList().then(() => {});
    }
  }, [isFocused]);

  return (
    <View style={styles.addressFormContainer}>
      <View style={styles.header}>
        <Text variant={'headlineSmall'}>
          {t('Address List.Select a Delivery Address')}
        </Text>
      </View>
      <Text variant={'labelLarge'} style={styles.shippingAddress}>
        {t('Address List.Saved Addresses')}
      </Text>
      {apiInProgress ? (
        <FlatList
          style={appStyles.container}
          data={skeletonList}
          renderItem={() => <AddressSkeleton />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainerStyle}
        />
      ) : (
        <>
          <FlatList
            style={appStyles.container}
            data={addresses}
            renderItem={({item}) => (
              <Address
                item={item}
                isCurrentAddress={deliveryAddress?.id === item?.id}
                params={{navigateToNext: true}}
                onAddressSelect={updateDeliveryAddress}
                detectAddressNavigation={detectAddressNavigation}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={[appStyles.container, appStyles.centerContainer]}>
                <Button
                  labelStyle={appStyles.containedButtonLabel}
                  contentStyle={appStyles.containedButtonContainer}
                  mode="outlined"
                  onPress={navigateToAddAddress}>
                  {t('Address List.Add new address')}
                </Button>
              </View>
            )}
            contentContainerStyle={
              addresses.length > 0
                ? styles.contentContainerStyle
                : appStyles.container
            }
          />
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToAddAddress}>
            <Text variant={'bodyLarge'} style={styles.buttonLabel}>
              {t('Address List.Add new address')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    addressFormContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
    },
    shippingAddress: {
      marginTop: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    billingAddressContainer: {
      marginTop: 20,
    },
    addressSelection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    addressText: {
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.white,
    },
    button: {
      marginVertical: 20,
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 13,
      alignItems: 'center',
      marginHorizontal: 16,
      height: 44,
    },
    buttonLabel: {
      color: colors.white,
    },
    contentContainerStyle: {
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
  });
export default AddressList;
