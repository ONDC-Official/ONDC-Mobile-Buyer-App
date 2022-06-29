import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import i18n from '../../../../locales/i18next';
import {appStyles} from '../../../../styles/styles';
import {CONTACT_US, FAQS, ONDC_POLICY, POLICY_URL,} from '../../../../utils/Constants';
import {keyExtractor} from '../../../../utils/utils';
import Header from '../../payment/addressPicker/Header';
import SupportCard from './SupportCard';

const image = require('../../../../assets/ondc.png');
const list = [
  {
    _id: 'bag-checked',
    icon: 'bag-checked',
    title: i18n.t('main.more.our_policy'),
    message: i18n.t('main.more.our_policy_message'),
    url: POLICY_URL,
  },
  {
    _id: 'help-circle',
    icon: 'help-circle',
    title: i18n.t('main.more.faqs'),
    message: i18n.t('main.more.faqs_message'),
    url: FAQS,
  },
  {
    _id: 'ondc_policy',
    source: image,
    title: i18n.t('main.more.ondc_policy'),
    message: i18n.t('main.more.ondc_policy_message'),
    url: ONDC_POLICY,
  },
  {
    _id: 'account',
    icon: 'account',
    title: i18n.t('main.more.contact_us'),
    message: i18n.t('main.more.contact_us_message'),
    url: CONTACT_US,
  },
];

/**
 * Component to render support  screen
 * @param navigation :application navigation object
 * @constructor
 * @returns {JSX.Element}
 */
const Support = ({navigation}) => (
  <SafeAreaView style={appStyles.container}>
    <View style={appStyles.container}>
      <Header title={i18n.t('main.more.support')} navigation={navigation}/>
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

export default Support;
