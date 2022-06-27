import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import AvatarImage from '../../../components/avatar/AvatarImage';
import {Context as AuthContext} from '../../../context/Auth';
import {appStyles} from '../../../styles/styles';
import {AVATAR_SIZES} from '../../../utils/Constants';
import Header from '../payment/addressPicker/Header';

/**
 * Component to render profile screen which shows user profile
 * @param navigation :application navigation object
 * @constructor
 * @returns {JSX.Element}
 */
const Profile = ({navigation}) => {
  const {t} = useTranslation();

  const {
    state: {name, emailId, photoURL},
  } = useContext(AuthContext);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={t('main.more.profile')} navigation={navigation}/>
        <View style={styles.container}>
          <AvatarImage uri={photoURL} dimension={AVATAR_SIZES.LARGE}/>
          <View style={styles.profileDetailsContainer}>
            {name !== 'Unknown' ? (
              <Text style={styles.name}>{name}</Text>
            ) : null}
            <Text>{emailId}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  name: {fontWeight: 'bold'},
  profileDetailsContainer: {marginLeft: 10},
});
