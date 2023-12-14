import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RadioButton, Text, useTheme} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import AddressForm from '../../dashboard/components/address/AddressForm';
import Address from '../../dashboard/components/address/Address';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, BILLING_ADDRESS} from '../../../../utils/apiActions';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';

interface AddressList {
  deliveryAddress: any;
  setBillingAddress: (newAddress: any) => void;
  setCurrentStep: (step: number) => void;
  currentStep: number;
  setDeliveryAddress: (newAddress: any) => void;
}

const CancelToken = axios.CancelToken;

const AddressList: React.FC<AddressList> = ({
  deliveryAddress,
  setBillingAddress,
  setCurrentStep,
  currentStep,
  setDeliveryAddress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {name, emailId} = useSelector(({authReducer}) => authReducer);
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const source = useRef<any>(null);
  const {postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [billingAddressType, setBillingAddressType] = useState<string>('');

  const updateDeliveryAddress = (newAddress: any) =>
    setDeliveryAddress(Object.assign({}, newAddress));

  const updateBillingAddressOption = (newValue: string) => {
    if (newValue === 'same') {
      setBillingAddress(Object.assign({}, deliveryAddress));
      setCurrentStep(currentStep + 1);
    } else {
      setShowAddressForm(true);
    }
    setBillingAddressType(newValue);
  };

  const saveBillingAddress = async (values: any) => {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.number,
      address: {
        areaCode: values.areaCode,
        building: values.building,
        city: values.city,
        country: 'IND',
        door: values.building,
        state: values.state,
        street: values.street,
        tag: values.tag,
        lat: values.lat,
        lng: values.lng,
      },
    };

    try {
      setApiInProgress(true);
      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${BILLING_ADDRESS}`,
        payload,
        source.current.token,
      );
      setBillingAddress(data);
      setCurrentStep(currentStep + 1);
      setShowAddressForm(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <View style={styles.addressFormContainer}>
      <Text variant={'titleMedium'} style={styles.addAddress}>
        Add Address
      </Text>
      {showAddressForm ? (
        <AddressForm
          addressInfo={{
            email: emailId || '',
            name: name || '',
            number: '',
            city: '',
            state: '',
            areaCode: '',
            street: '',
            building: '',
            tag: '',
          }}
          apiInProgress={apiInProgress}
          saveAddress={saveBillingAddress}
        />
      ) : (
        <>
          <Text variant={'bodyLarge'} style={styles.shippingAddress}>
            Shipping Address
          </Text>
          <Address
            item={address}
            isCurrentAddress={!!deliveryAddress}
            params={{navigateToNext: true}}
            onAddressSelect={updateDeliveryAddress}
          />
          <View style={styles.billingAddressContainer}>
            <RadioButton.Group
              onValueChange={newValue => updateBillingAddressOption(newValue)}
              value={billingAddressType}>
              <View style={styles.addressSelection}>
                <RadioButton.Android value="same" disabled={!deliveryAddress} />
                <Text
                  variant={'bodySmall'}
                  style={styles.addressText}
                  numberOfLines={2}>
                  My billing and shipping address are the same
                </Text>
              </View>
              <View style={styles.addressSelection}>
                <RadioButton.Android value="new" />
                <Text variant={'bodySmall'} style={styles.addressText}>
                  Add New Billing Address
                </Text>
              </View>
            </RadioButton.Group>
          </View>
        </>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    addressFormContainer: {
      flex: 1,
      padding: 16,
    },
    addAddress: {
      marginBottom: 20,
    },
    shippingAddress: {
      marginBottom: 12,
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
  });
export default AddressList;
