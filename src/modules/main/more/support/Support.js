import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, View} from 'react-native';
import {appStyles} from '../../../../styles/styles';
import {
  CONTACT_US,
  FAQS,
  ONDC_POLICY,
  POLICY_URL,
} from '../../../../utils/Constants';
import {keyExtractor} from '../../../../utils/utils';
import Header from '../../payment/addressPicker/Header';
import SupportCard from './SupportCard';

const image = require('../../../../assets/ondc.png');

/**
 * Component to render support  screen
 * @param navigation :application navigation object
 * @constructor
 * @returns {JSX.Element}
 */
const Support = ({navigation}) => {
  const {t} = useTranslation();

  const list = [
    {
      _id: 'ghjshgkjdj',
      icon: 'bag-checked',
      title: t('main.more.our_policy'),
      message: t('main.more.our_policy_message'),
      url: POLICY_URL,
    },
    {
      _id: 'mkmnjhj',
      icon: 'help-circle',
      title: t('main.more.faqs'),
      message: t('main.more.faqs_message'),
      url: FAQS,
    },
    {
      _id: 'mjknhbgyj',
      source: image,
      title: t('main.more.ondc_policy'),
      message: t('main.more.ondc_policy_message'),
      url: ONDC_POLICY,
    },
    {
      _id: 'gghjghj',
      icon: 'account',
      title: t('main.more.contact_us'),
      message: t('main.more.contact_us_message'),
      url: CONTACT_US,
    },
  ];

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={t('main.more.support')} navigation={navigation} />
        <FlatList
          data={list}
          keyExtractor={keyExtractor}
          renderItem={({item}) => (
            <SupportCard
              icon={item.icon}
              source={item.source}
              title={item.title}
              url={item.url}
              message={item.message}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Support;
