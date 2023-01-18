import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {clearAllData} from '../../../redux/actions';
import {appStyles} from '../../../styles/styles';
import {alertWithTwoButtons} from '../../../utils/alerts';
import {OPTIONS} from '../../../utils/Constants';
import OptionCard from './OptionCard';
import {logoutUser} from '../../../redux/auth/actions';
import {withTheme} from 'react-native-paper';

const list = [
  {
    id: OPTIONS.PROFILE,
    name: OPTIONS.PROFILE,
    string: 'Profile',
    icon: 'user',
  },
  {
    id: OPTIONS.SUPPORT,
    name: OPTIONS.SUPPORT,
    string: 'Support',
    icon: 'question',
  },
  {
    id: OPTIONS.LOG_OUT,
    name: OPTIONS.LOG_OUT,
    string: 'Logout',
    icon: 'sign-out',
  },
];

/**
 * Component to render more options available for user
 * @constructor
 * @returns {JSX.Element}
 */
const More = ({navigation}) => {
  const dispatch = useDispatch();

  /**
   * Function handles click event of card and depending on option it navigates to respective screen
   */
  const action = option => {
    if (option === OPTIONS.LOG_OUT) {
      alertWithTwoButtons(
        null,
        'Are you sure you want to log out?',
        'Ok',
        () => {
          logoutUser(dispatch);
          dispatch(clearAllData());
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
        'Cancel',
        () => {},
      );
    } else if (option === OPTIONS.PROFILE) {
      navigation.navigate('Profile');
    } else if (option === OPTIONS.SUPPORT) {
      navigation.navigate('Support');
    }
  };
  /**
   * Function  used to render single option card in the list
   * @param item: single object from  list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => <OptionCard item={item} action={action} />;

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <FlatList
          data={list}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(More);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 10},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row', padding: 20},
});
