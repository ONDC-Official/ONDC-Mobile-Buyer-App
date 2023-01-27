import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {withTheme} from 'react-native-paper';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../../utils/api';
import {BASE_URL, BILLING_ADDRESS} from '../../../../utils/apiUtilities';
import BillingAddressForm from './components/BillingAddressForm';
import {billingAddressValidationSchema} from './utils/validations';

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddBillingAddress = ({navigation, theme}) => {
  const {handleApiError} = useNetworkErrorHandling();

  const {token, name, emailId} = useSelector(({authReducer}) => authReducer);

  const [apiInProgress, setApiInProgress] = useState(false);

  let addressInfo = {
    email: emailId,
    name: name,
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
      await postData(`${BASE_URL}${BILLING_ADDRESS}`, payload, options);
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
      buttonLabel={'Add Address'}
    />
  );
};

export default withTheme(AddBillingAddress);
