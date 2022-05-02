import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useContext} from 'react';
import Config from 'react-native-config';
import {Context as AuthContext} from '../../../../context/Auth';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_CLIENT_ID,
});

export default navigation => {
  const {storeLoginDetails} = useContext(AuthContext);

  const loginWithGoogle = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      const idTokenResult = await auth().currentUser.getIdTokenResult();

      await storeLoginDetails({
        token: idTokenResult.token,
        uid: idTokenResult.claims.user_id,
        emailId: idTokenResult.claims.email,
        name: 'Unknown',
        photoURL: 'Unknown',
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {loginWithGoogle};
};
