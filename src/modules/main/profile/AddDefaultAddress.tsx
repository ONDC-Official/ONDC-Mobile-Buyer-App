import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, DELIVERY_ADDRESS} from '../../../utils/apiActions';
import {setStoredData} from '../../../utils/storage';
import AddressForm from '../dashboard/components/address/AddressForm';
import useRefreshToken from '../../../hooks/useRefreshToken';
import {showInfoToast} from '../../../utils/utils';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import {setAddress} from '../../../toolkit/reducer/address';

interface AddDefaultAddress {
  navigation: any;
  route: any;
}

const CancelToken = axios.CancelToken;
/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddDefaultAddress: React.FC<AddDefaultAddress> = ({
  navigation,
  route: {params},
}) => {
  const dispatch = useDispatch();
  const {getUserToken} = useRefreshToken();
  const {t} = useTranslation();
  const source = useRef<any>(null);
  const {name, emailId} = useSelector(({auth}) => auth);
  const {postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);

  /**
   * Function is used to save new address
   * @param values:object containing user inputs
   * @returns {Promise<void>}
   **/
  const saveToServer = async (values: any) => {
    const payload = {
      descriptor: {
        name: values.name,
        email: values.email,
        phone: values.number,
      },
      defaultAddress: true,
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
        `${API_BASE_URL}${DELIVERY_ADDRESS}`,
        payload,
        source.current.token,
      );
      showInfoToast(
        t('Address Form.Your delivery address has been added successfully'),
      );
      await setStoredData('address', JSON.stringify(data));
      dispatch(setAddress(data));
      if (!params) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } else {
        navigation.goBack();
      }
      setApiInProgress(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiInProgress(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: t('Address Form.Add Address'),
    });
    getUserToken().then(() => {});
  }, []);

  return (
    <AddressForm
      name={name || ''}
      email={emailId || ''}
      phone={''}
      address={null}
      apiInProgress={apiInProgress}
      saveAddress={saveToServer}
    />
  );
};

export default AddDefaultAddress;
