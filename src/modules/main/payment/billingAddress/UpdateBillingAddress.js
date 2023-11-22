import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {withTheme} from 'react-native-paper';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../../utils/api';
import {BASE_URL, UPDATE_BILLING_ADDRESS} from '../../../../utils/apiUtilities';
import BillingAddressForm from './components/BillingAddressForm';
import {billingAddressValidationSchema} from './utils/validations';
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
const UpdateBillingAddress = ({navigation, theme, route: {params}}) => {
  const {} = useRefreshToken();
  const {handleApiError} = useNetworkErrorHandling();

  const {token} = useSelector(({authReducer}) => authReducer);

  const [apiInProgress, setApiInProgress] = useState(false);

  let addressInfo = {
    email: params.address.email,
    name: params.address.name,
    number: params.address.phone,
    city: params.address.address.city,
    state: params.address.address.state,
    pin: params.address.address.areaCode,
    landMark: params.address.address.locality,
    street: params.address.address.street,
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
      address: {
        areaCode: values.pin,
        city: values.city,
        locality: values.landMark,
        state: values.state,
        street: values.street,
        country: 'IND',
      },
      name: values.name,
      email: values.email,
      phone: values.number,
    };

    try {
      setApiInProgress(true);
      await postData(
        `${BASE_URL}${UPDATE_BILLING_ADDRESS}${params.address.id}`,
        payload,
        options,
      );
      showInfoToast('Your billing address has been updated successfully.');
      navigation.goBack();
      setApiInProgress(false);
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
    <BillingAddressForm
      addressInfo={addressInfo}
      saveAddress={saveAddress}
      apiInProgress={apiInProgress}
      validationSchema={billingAddressValidationSchema}
      buttonLabel={'Update Address'}
    />
  );
};

export default withTheme(UpdateBillingAddress);
