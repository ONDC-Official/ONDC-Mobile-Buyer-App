import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import {OPTIONS} from '../../../utils/Constants';
import OptionCard from './OptionCard';

const list = [
  {
    id: 'gvjh',
    name: OPTIONS.PROFILE,
    string: strings('main.more.profile'),
    icon: 'user',
  },
  {
    id: 'nmnvh',
    name: OPTIONS.LOG_OUT,
    string: strings('main.more.log_out'),
    icon: 'sign-out',
  },
];

/**
 * @constructor
 * @returns {JSX.Element}
 */
const More = ({theme, navigation}) => {
  const {colors} = theme;

  const renderItem = ({item}) => {
    return <OptionCard item={item} navigation={navigation}/>;
  };
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
