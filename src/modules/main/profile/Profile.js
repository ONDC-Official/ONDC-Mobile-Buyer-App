import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Avatar, Text} from 'react-native-paper';

import {appStyles} from '../../../styles/styles';
import {getUserInitials} from '../../../utils/utils';

/**
 * Component to render profile screen which shows user profile
 * @constructor
 * @returns {JSX.Element}
 */
const Profile = () => {
  const {name, emailId, photoURL} = useSelector(({authReducer}) => authReducer);

  return (
    <View style={[appStyles.container, appStyles.centerContainer]}>
      {photoURL ? (
        <Avatar.Image size={72} rounded source={{uri: photoURL}}/>
      ) : (
        <Avatar.Text size={72} rounded label={getUserInitials(name ?? '')}/>
      )}
      <View style={styles.container}>
        <View style={styles.profileDetailsContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text>{emailId}</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  name: {fontWeight: 'bold', fontSize: 20, marginVertical: 12},
  profileDetailsContainer: {
    alignItems: 'center',
  },
});
