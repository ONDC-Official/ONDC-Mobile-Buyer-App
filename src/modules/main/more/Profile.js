import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Context as AuthContext} from '../../../context/Auth';
import {appStyles} from '../../../styles/styles';
import {AVATAR_SIZES} from '../../../utils/Constants';
import {Text} from 'react-native-elements';
import AvatarImage from '../../../components/avatar/AvatarImage';
import Header from '../cart/addressPicker/Header';
import {strings} from '../../../locales/i18n';

const profile = strings('main.more.profile');

const Profile = ({navigation}) => {
  const {
    state: {name, emailId, photoURL},
  } = useContext(AuthContext);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={profile} navigation={navigation} />
        <View style={styles.container}>
          <AvatarImage uri={photoURL} dimension={AVATAR_SIZES.LARGE} />
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
