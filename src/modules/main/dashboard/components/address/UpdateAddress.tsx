import React, {useRef, useState} from 'react';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  UPDATE_DELIVERY_ADDRESS,
} from '../../../../../utils/apiActions';
import AddressForm from './AddressForm';
import useRefreshToken from '../../../../../hooks/useRefreshToken';
import {showInfoToast} from '../../../../../utils/utils';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';

interface UpdateAddress {
  navigation: any;
  route: any;
}

const CancelToken = axios.CancelToken;
/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const UpdateAddress: React.FC<UpdateAddress> = ({
  navigation,
  route: {params},
}) => {
  const {} = useRefreshToken();
  const {t} = useTranslation();
  const source = useRef<any>(null);
  const {postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);

  /**
   * Function is used to save new address
   * @param values:object containing user inputs
   * @returns {Promise<void>}
   **/
  const saveAddress = async (values: any) => {
    const payload: any = {
      descriptor: {
        name: values.name,
        email: values.email,
        phone: values.number,
      },
      defaultAddress: values.defaultAddress,
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
      await postDataWithAuth(
        `${API_BASE_URL}${UPDATE_DELIVERY_ADDRESS}${params.address.id}`,
        payload,
        source.current.token,
      );
      showInfoToast(
        t('Address Form.Your delivery address has been updated successfully'),
      );
      navigation.goBack();
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiInProgress(false);
    }
  };

  const {descriptor, address} = params.address;

  return (
    <AddressForm
      name={descriptor.name}
      email={descriptor.email}
      phone={descriptor.phone}
      address={address}
      apiInProgress={apiInProgress}
      saveAddress={saveAddress}
    />
  );
};

export default UpdateAddress;
