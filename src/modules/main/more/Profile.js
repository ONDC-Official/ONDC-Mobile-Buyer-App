import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import Header from '../payment/addressPicker/Header';
import {useSelector} from 'react-redux';

/**
 * Component to render profile screen which shows user profile
 * @param navigation :application navigation object
 * @constructor
 * @returns {JSX.Element}
 */
const Profile = ({navigation}) => {
  const {name, emailId} = useSelector(({authReducer}) => authReducer);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={'Profile'} navigation={navigation}/>
        <View style={styles.container}>
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
