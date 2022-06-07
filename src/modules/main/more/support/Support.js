import React from 'react';
import {FlatList, SafeAreaView, ScrollView, View} from 'react-native';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {
  CONTACT_US,
  FAQS,
  ONDC_POLICY,
  POLICY_URL,
} from '../../../../utils/Constants';
import {keyExtractor} from '../../../../utils/utils';
import Header from '../../cart/addressPicker/Header';
import SupportCard from './SupportCard';

const image = require('../../../../assets/ondc.png');

const heading = strings('main.more.support');
const ourPolicy = strings('main.more.our_policy');
const outPolicyMessage = strings('main.more.our_policy_message');
const faqs = strings('main.more.faqs');
const faqsMessage = strings('main.more.faqs_message');
const ondcPolicy = strings('main.more.ondc_policy');
const ondcPolicyMessage = strings('main.more.ondc_policy_message');
const contactUs = strings('main.more.contact_us');
const contactUsMessage = strings('main.more.contact_us_message');

const list = [
  {
    _id: 'ghjshgkjdj',
    icon: 'bag-checked',
    title: ourPolicy,
    message: outPolicyMessage,
    url: POLICY_URL,
  },
  {
    _id: 'mkmnjhj',
    icon: 'help-circle',
    title: faqs,
    message: faqsMessage,
    url: FAQS,
  },
  {
    _id: 'mjknhbgyj',
    source: image,
    title: ondcPolicy,
    message: ondcPolicyMessage,
    url: ONDC_POLICY,
  },
  {
    _id: 'gghjghj',
    icon: 'account',
    title: contactUs,
    message: contactUsMessage,
    url: CONTACT_US,
  },
];

/**
 * Component to render support  screen
 * @param navigation :application navigation object
 * @constructor
 * @returns {JSX.Element}
 */
const Support = ({navigation}) => {
  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={heading} navigation={navigation} />
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
