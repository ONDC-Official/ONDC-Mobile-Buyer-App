import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_CLIENT_ID,
});

export default navigation => {
  const loginWithGoogle = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      console.log(googleCredential);

      // Sign-in the user with the credential
      const response = await auth().signInWithCredential(googleCredential);

      const idTokenResult = await auth().currentUser.getIdTokenResult();
      console.log('User JWT: ', idTokenResult);

      // if (response) {
      //   navigation.navigate('Dashboard');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return {loginWithGoogle};
};
