import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native-paper';
import {getBuildNumber, getVersion} from 'react-native-device-info';

import {appStyles} from '../../../styles/styles';
import ONDCLogo from '../../../assets/ondc.svg';
import {tryLocalSignIn} from '../../../redux/auth/actions';

interface Splash {
  navigation: any;
}

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash: React.FC<Splash> = ({navigation}) => {
  const dispatch = useDispatch();

  /**
   * Function is used to check if the token is available
   * @returns {Promise<void>}
   */
  const checkIfUserIsLoggedIn = async () => {
    try {
      await tryLocalSignIn(dispatch, navigation);
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checkIfUserIsLoggedIn().then(() => {
      });
    }, 3000);
  }, []);

  return (
    <View style={[appStyles.container, appStyles.backgroundWhite]}>
      <View style={[appStyles.container, styles.container]}>
        <Text style={styles.appName}>Reference Buyer App</Text>
        <View style={styles.ondcContainer}>
          <Text style={styles.poweredBy}>Powered By</Text>
          <ONDCLogo width={240} height={95}/>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>
          Version: {getVersion()} - ({getBuildNumber()})
        </Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  appName: {color: '#06038D', fontSize: 28, fontWeight: '500'},
  ondcContainer: {
    marginTop: 50,
  },
  poweredBy: {
    color: '#00AEEF',
    marginBottom: 16,
    textAlign: 'center',
  },
  container: {alignItems: 'center', justifyContent: 'center'},
  footer: {alignItems: 'center', marginBottom: 20},
});
