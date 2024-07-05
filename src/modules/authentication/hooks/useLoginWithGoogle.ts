import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import useStoreUserAndNavigate from '../../../hooks/useStoreUserAndNavigate';

export default () => {
  const {storeDetails} = useStoreUserAndNavigate();

  const loginWithGoogle = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
      if (!auth()?.currentUser?.emailVerified) {
        await auth().currentUser?.sendEmailVerification();
      }
      await storeDetails(idTokenResult, auth()?.currentUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_CLIENT_ID,
    });
  }, []);

  return {loginWithGoogle};
};
