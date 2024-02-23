import React, {useEffect} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native-paper';
import {getVersion} from 'react-native-device-info';

import {appStyles} from '../../../styles/styles';
import ONDCLogo from '../../../assets/ondc.svg';
import {tryLocalSignIn} from '../../../redux/auth/actions';
import {getMultipleData} from '../../../utils/storage';
import {useAppTheme} from '../../../utils/theme';

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
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

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
    const timeOut = setTimeout(() => {
      checkIfUserIsLoggedIn().then(() => {});
    }, 3000);

    Linking.getInitialURL().then(url => {
      if (url) {
        clearTimeout(timeOut);
        const payload: any = {};
        getMultipleData(['token', 'uid', 'emailId', 'name']).then(data => {
          if (data[0][1] !== null) {
            data.forEach((item: any) => {
              try {
                payload[item[0]] = JSON.parse(item[1]);
              } catch (error) {
                payload[item[0]] = item[1];
              }
            });
            dispatch({type: 'save_user', payload});
            const urlParams: any = {};
            const params = url.split('?');
            if (params.length > 0) {
              const variables = params[1].split('&');
              variables.forEach(one => {
                const fields = one.split('=');
                if (fields.length > 0) {
                  urlParams[fields[0]] = fields[1];
                  if (urlParams.hasOwnProperty('context.provider.id')) {
                    navigation.navigate('BrandDetails', {
                      brandId: urlParams['context.provider.id'],
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }, []);

  return (
    <View style={[appStyles.container, appStyles.backgroundWhite]}>
      <View style={[appStyles.container, styles.container]}>
        <ONDCLogo width={240} height={95} />
      </View>
      <View style={styles.footer}>
        <Text>Version: {getVersion()}</Text>
      </View>
    </View>
  );
};

export default Splash;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {alignItems: 'center', justifyContent: 'center'},
    footer: {alignItems: 'center', marginBottom: 20},
  });
