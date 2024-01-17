import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, IconButton, Text, useTheme} from 'react-native-paper';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Address from '../../dashboard/components/address/Address';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, DELIVERY_ADDRESS} from '../../../../utils/apiActions';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {skeletonList} from '../../../../utils/utils';
import {appStyles} from '../../../../styles/styles';
import AddressSkeleton from '../../dashboard/components/address/AddressSkeleton';
import {saveAddress} from '../../../../redux/address/actions';

interface AddressList {
  deliveryAddress: any;
  setDeliveryAddress: (newAddress: any) => void;
  closeSheet: () => void;
}

const CancelToken = axios.CancelToken;

const AddressList: React.FC<AddressList> = ({
  deliveryAddress,
  setDeliveryAddress,
  closeSheet,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<any[]>([]);

  const updateDeliveryAddress = (newAddress: any) => {
    dispatch(saveAddress(newAddress));
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

  useEffect(() => {
    if (isFocused) {
      getAddressList().then(() => {
      });
    }
  }, [isFocused]);

  return (
    <View style={styles.addressFormContainer}>
      <View style={styles.header}>
        <Text variant={'titleMedium'}>Select a Delivery Address</Text>
        <IconButton icon={'close-circle'} onPress={closeSheet} />
      </View>
      <Text variant={'labelLarge'} style={styles.shippingAddress}>
        Saved Addresses
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
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={[appStyles.container, appStyles.centerContainer]}>
                <Button
                  labelStyle={appStyles.containedButtonLabel}
                  contentStyle={appStyles.containedButtonContainer}
                  mode="outlined"
                  onPress={() => navigation.navigate('AddDefaultAddress')}>
                  Add Address
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
            onPress={() => navigation.navigate('AddDefaultAddress')}>
            <Text variant={'labelLarge'} style={styles.buttonLabel}>
              Add new address
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
    },
    shippingAddress: {
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
      paddingHorizontal: 16,
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      borderRadius: 22,
      padding: 12,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    buttonLabel: {
      color: '#fff',
    },
    contentContainerStyle: {
      paddingBottom: 16,
    },
  });
export default AddressList;
