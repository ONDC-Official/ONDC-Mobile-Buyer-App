import React, {useState} from 'react';
import {withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../utils/api';
import {BASE_URL, DELIVERY_ADDRESS} from '../../../utils/apiUtilities';
import {setStoredData} from '../../../utils/storage';
import AddressForm from '../dashboard/components/address/AddressForm';
import useRefreshToken from '../../../hooks/useRefreshToken';
import {showInfoToast} from '../../../utils/utils';

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddDefaultAddress = ({navigation, theme, route: {params}}) => {
  const {} = useRefreshToken();
  const {token, name, emailId} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  let addressInfo = {
    email: emailId || '',
    name: name || '',
    number: '',
    city: '',
    state: '',
    pin: '',
    landMark: '',
    street: '',
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
      gps: `${latitude},${longitude}`,
      defaultAddress: true,
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
      const {data} = await postData(
        `${BASE_URL}${DELIVERY_ADDRESS}`,
        payload,
        options,
      );
      if (!params) {
        await setStoredData('address', JSON.stringify(data));
      }
      setApiInProgress(false);
      showInfoToast('Your delivery address has been added successfully.');
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
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

export default withTheme(AddDefaultAddress);
