import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import {appStyles} from '../../../styles/styles';
import {OPTIONS} from '../../../utils/Constants';
import OptionCard from './OptionCard';

/**
 * Component to render more options available for user
 * @constructor
 * @returns {JSX.Element}
 */
const More = ({navigation}) => {
  const {t} = useTranslation();

  const list = [
    {
      id: 'gvjh',
      name: OPTIONS.PROFILE,
      string: t('main.more.profile'),
      icon: 'user',
    },
    {
      id: 'jnhbgv',
      name: OPTIONS.SUPPORT,
      string: t('main.more.support'),
      icon: 'question',
    },
    {
      id: 'nmnvh',
      name: OPTIONS.LOG_OUT,
      string: t('main.more.log_out'),
      icon: 'sign-out',
    },
  ];

  /**
   * Function  used to render single option card in the list
   * @param item: single object from  list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    return <OptionCard item={item} navigation={navigation} />;
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
