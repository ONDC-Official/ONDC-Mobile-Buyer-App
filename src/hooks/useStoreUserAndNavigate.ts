import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import uuid from 'react-native-uuid';

import {getStoredData, saveMultipleData} from '../utils/storage';
import {setLoginDetails} from '../toolkit/reducer/auth';
import i18n from '../i18n';

export default () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const checkLanguageAndLogin = () => {
    getStoredData('language').then(language => {
      if (!language) {
        navigation.reset({
          index: 0,
          routes: [{name: 'ChooseLanguage'}],
        });
      } else {
        i18n.changeLanguage(language).then(() => {
          getStoredData('address').then(address => {
            if (address) {
              navigation.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'AddressList', params: {navigateToDashboard: true}},
                ],
              });
            }
          });
        });
      }
    });
  };

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
      dispatch(setLoginDetails(payload));
      checkLanguageAndLogin();
    } catch (error) {
      console.error(error);
    }
  };

  return {storeDetails};
};
