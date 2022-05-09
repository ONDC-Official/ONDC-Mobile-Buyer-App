import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {
  CONTACT_US,
  FAQS,
  ONDC_POLICY,
  POLICY_URL,
} from '../../../../utils/Constants';
import Header from '../../cart/addressPicker/Header';
import SupportCard from './SupportCard';

const image = require('../../../../assets/logo.png');

const heading = strings('main.more.support');
const ourPolicy = strings('main.more.our_policy');
const outPolicyMessage = strings('main.more.our_policy_message');
const faqs = strings('main.more.faqs');
const faqsMessage = strings('main.more.faqs_message');
const ondcPolicy = strings('main.more.ondc_policy');
const ondcPolicyMessage = strings('main.more.ondc_policy_message');
const contactUs = strings('main.more.contact_us');
const contactUsMessage = strings('main.more.contact_us_message');

const Support = ({navigation}) => {
  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={heading} navigation={navigation} />
        <ScrollView>
          <SupportCard
            icon={'bag-checked'}
            title={ourPolicy}
            message={outPolicyMessage}
            url={POLICY_URL}
          />

          <SupportCard
            icon={'help-circle'}
            title={faqs}
            message={faqsMessage}
            url={FAQS}
          />

          <SupportCard
            source={image}
            title={ondcPolicy}
            message={ondcPolicyMessage}
            url={ONDC_POLICY}
          />

          <SupportCard
            icon={'account'}
            title={contactUs}
            message={contactUsMessage}
            url={CONTACT_US}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Support;
