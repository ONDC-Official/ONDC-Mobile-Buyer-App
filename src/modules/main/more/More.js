import {useContext} from 'react';
import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import i18n from '../../../locales/i18next';
import {clearAllData} from '../../../redux/actions';
import {appStyles} from '../../../styles/styles';
import {alertWithTwoButtons} from '../../../utils/alerts';
import {OPTIONS} from '../../../utils/Constants';
import OptionCard from './OptionCard';

const list = [
  {
    id: OPTIONS.PROFILE,
    name: OPTIONS.PROFILE,
    string: i18n.t('main.more.profile'),
    icon: 'user',
  },
  {
    id: OPTIONS.SUPPORT,
    name: OPTIONS.SUPPORT,
    string: i18n.t('main.more.support'),
    icon: 'question',
  },
  {
    id: OPTIONS.LOG_OUT,
    name: OPTIONS.LOG_OUT,
    string: i18n.t('main.more.log_out'),
    icon: 'sign-out',
  },
];

/**
 * Component to render more options available for user
 * @constructor
 * @returns {JSX.Element}
 */
const More = ({navigation}) => {
  const {logoutUser} = useContext(AuthContext);

  /**
   * Function handles click event of card and depending on option it navigates to respective screen
   */
  const action = (option) => {
    if (option === OPTIONS.LOG_OUT) {
      alertWithTwoButtons(
        null,
        t('main.more.log_out_message'),
        t('main.product.ok_label'),
        () => {
          logoutUser();
          dispatch(clearAllData());
          navigation.reset({
            index: 0,
            routes: [{name: 'Landing'}],
          });
        },
        t('main.product.cancel_label'),
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
  const renderItem = ({item}) => <OptionCard item={item} action={action}/>;

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
