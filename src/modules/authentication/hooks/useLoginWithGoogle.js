import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import {storeLoginDetails} from '../../../redux/auth/actions';
import {getStoredData} from '../../../utils/storage';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_CLIENT_ID,
});

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const loginWithGoogle = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      const idTokenResult = await auth().currentUser.getIdTokenResult();

      await storeLoginDetails(dispatch, {
        token: idTokenResult.token,
        uid: idTokenResult.claims.user_id,
        emailId: idTokenResult.claims.email,
        name: idTokenResult.claims.name,
        photoURL: idTokenResult.claims.picture,
      });

      const address = await getStoredData('address');
      if (address) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'AddressList', params: {navigateToDashboard: true}}],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {loginWithGoogle};
};
