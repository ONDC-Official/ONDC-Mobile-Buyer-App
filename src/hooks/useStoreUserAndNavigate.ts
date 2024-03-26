import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import uuid from 'react-native-uuid';

import {saveMultipleData} from '../utils/storage';
import {checkLanguageAndLogin} from '../redux/auth/actions';

export default () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const storeDetails = async (idTokenResult: any, user: any) => {
    try {
      const name = user?.displayName ? user?.displayName : 'Unknown';
      const photoURL = user?.photoURL ? user?.photoURL : '';
      const transactionId: any = uuid.v4();

      const storageData = [
        ['token', idTokenResult?.token],
        ['uid', user?.uid],
        ['name', name],
        ['photoURL', photoURL],
        ['transaction_id', transactionId],
      ];

      if (user.email) {
        storageData.push(['emailId', user?.email]);
      }
      if (user.phoneNumber) {
        storageData.push(['phoneNumber', user?.phoneNumber]);
      }
      await saveMultipleData(storageData);
      const payload = {
        token: idTokenResult?.token,
        emailId: user?.email,
        phoneNumber: user?.phoneNumber,
        uid: user?.uid,
        name: name,
        photoURL: photoURL,
        transaction_id: transactionId,
      };
      dispatch({type: 'set_login_details', payload});

      checkLanguageAndLogin(navigation);
    } catch (error) {
      console.error(error);
    }
  };

  return {storeDetails};
};
