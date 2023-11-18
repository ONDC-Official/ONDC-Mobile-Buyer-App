import React, {useState} from 'react';
import {withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {BASE_URL, UPDATE_DELIVERY_ADDRESS,} from '../../../../utils/apiUtilities';
import {postData} from '../../../../utils/api';
import AddressForm from './AddressForm';
import useRefreshToken from '../../../../hooks/useRefreshToken';
import {showInfoToast} from '../../../../utils/utils';

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const UpdateAddress = ({navigation, theme, route: {params}}) => {
  const {} = useRefreshToken();
  const {token} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  let addressInfo = {
    email: params.address.descriptor.email,
    name: params.address.descriptor.name,
    number: params.address.descriptor.phone,
    city: params.address.address.city,
    state: params.address.address.state,
    pin: params.address.address.areaCode,
    landMark: params.address.address.locality,
    street: params.address.address.street,
    tag: params.address.address.tag,
    defaultAddress: params.address.defaultAddress,
    gps: params.address.gps,
  };

  /**
   * Function is used to save new address
   * @param values:object containing user inputs
   * @returns {Promise<void>}
   **/
  const saveAddress = async values => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      descriptor: {
        name: values.name,
        email: values.email,
        phone: values.number,
      },
      gps: latitude === null ? values.gps : `${latitude},${longitude}`,
      defaultAddress: values.defaultAddress,
      address: {
        areaCode: values.pin,
        city: values.city,
        locality: values.landMark,
        state: values.state,
        street: values.street,
        country: 'IND',
        tag: values.tag,
      },
    };

    try {
      setApiInProgress(true);
      await postData(
        `${BASE_URL}${UPDATE_DELIVERY_ADDRESS}${params.address.id}`,
        payload,
        options,
      );
      showInfoToast('Your delivery address has been added successfully');
      setApiInProgress(false);
      navigation.goBack();
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
    <AddressForm
      addressInfo={addressInfo}
      apiInProgress={apiInProgress}
      saveAddress={saveAddress}
      setLatitude={setLatitude}
      setLongitude={setLongitude}
    />
  );
};

export default withTheme(UpdateAddress);
