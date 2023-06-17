import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Button, withTheme, RadioButton, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, BILLING_ADDRESS} from '../../../../utils/apiUtilities';
import {skeletonList} from '../../../../utils/utils';
import {getStoredData} from '../../../../utils/storage';
import AddressSkeleton from '../../dashboard/components/AddressSkeleton';
import BillingAddress from './components/BillingAddress';
import useRefreshToken from '../../../../hooks/useRefreshToken';

/**
 * Component to render addresses of address
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const BillingAddressPicker = ({navigation, theme}) => {
  const {} = useRefreshToken();
  const [apiInProgress, setApiInProgress] = useState(true);
  const [addresses, setAddresses] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);

  const isFocused = useIsFocused();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();

  /**
   * function handles click event of add billing address button
   */
  const onAdd = () => navigation.navigate('AddBillingAddress');

  /**
   * function to get addresses of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      setApiInProgress(true);
      const {data} = await getData(`${BASE_URL}${BILLING_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(data);
      setApiInProgress(false);
    } catch (error) {
      setApiInProgress(false);
      if (error.response) {
        if (error.response.status === 404) {
          setAddresses([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  /**
   * Function is used to render single address card in the addresses
   * @param item: single object from address addresses
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const onEdit = () => {
      // navigation.navigate('AddAddress', {
      //   selectedAddress: selectedAddress,
      //   item: item,
      // });
    };

    const isSelected = billingAddress?.id === item?.id;
    return item.hasOwnProperty('isSkeleton') ? (
      <AddressSkeleton item={item} />
    ) : (
      <BillingAddress
        item={item}
        isCurrentAddress={isSelected}
        onEdit={onEdit}
        setBillingAddress={setBillingAddress}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          contentStyle={appStyles.containedButtonContainer}
          labelStyle={appStyles.containedButtonLabel}
          mode="text"
          style={{marginEnd: 10}}
          onPress={onAdd}>
          Add
        </Button>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      getStoredData('address').then(response => {
        if (response) {
          setDeliveryAddress(JSON.parse(response));
        }
      });
      setBillingAddress(null);
      getAddressList()
        .then(() => {})
        .catch(() => {});
    }
  }, [isFocused]);

  const list = apiInProgress ? skeletonList : addresses;
  return (
    <View style={appStyles.container}>
      <TouchableOpacity
        style={styles.sameAsDeliverContainer}
        onPress={() => setBillingAddress(deliveryAddress)}>
        <RadioButton.Android
          value="first"
          status={
            billingAddress?.id === deliveryAddress?.id ? 'checked' : 'unchecked'
          }
          onPress={() => setBillingAddress(deliveryAddress)}
        />
        <Text>Same as delivery address.</Text>
      </TouchableOpacity>
      <FlatList
        style={appStyles.container}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={[appStyles.container, appStyles.centerContainer]}>
            <Button
              labelStyle={appStyles.containedButtonLabel}
              contentStyle={appStyles.containedButtonContainer}
              mode="outlined"
              onPress={onAdd}>
              Add Billing Address
            </Button>
          </View>
        )}
        contentContainerStyle={
          list?.length > 0 ? styles.contentContainerStyle : appStyles.container
        }
      />

      {billingAddress !== null && (
        <View style={styles.buttonContainer}>
          <Button
            labelStyle={appStyles.containedButtonLabel}
            contentStyle={appStyles.containedButtonContainer}
            mode="contained"
            onPress={() =>
              navigation.navigate('Confirmation', {
                billingAddress,
                deliveryAddress,
              })
            }>
            Next
          </Button>
        </View>
      )}
    </View>
  );
};

export default withTheme(BillingAddressPicker);

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginVertical: 10,
    alignSelf: 'center',
  },
  contentContainerStyle: {marginVertical: 16},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  sameAsDeliverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    borderWidth: 0.2,
    borderRadius: 8,
  },
});
