import React from 'react';
import {FlatList, View} from 'react-native';

import {appStyles} from '../../../styles/styles';
import {CONTACT_US, FAQS, ONDC_POLICY, POLICY_URL,} from '../../../utils/constants';
import {keyExtractor} from '../../../utils/utils';
import SupportCard from './SupportCard';

const image = require('../../../assets/ondc.png');
const list = [
  {
    _id: 'bag-checked',
    icon: 'bag-checked',
    title: 'Our Policy',
    message:
      "Read Abc's condition of Use & Sale, privacy policy and other applicable user's policy",
    url: POLICY_URL,
  },
  {
    _id: 'help-circle',
    icon: 'help-circle',
    title: 'FAQs',
    message: 'Browse through the questions frequently asked by users',
    url: FAQS,
  },
  {
    _id: 'ondc_policy',
    source: image,
    title: 'ONDC Policy',
    message: 'Read the policy and conditions of the ONDC network',
    url: ONDC_POLICY,
  },
  {
    _id: 'account',
    icon: 'account',
    title: 'Contact Us',
    message: 'Not Satisfied? You can reach out to Customer Care',
    url: CONTACT_US,
  },
];

/**
 * Component to render support  screen
 * @constructor
 * @returns {JSX.Element}
 */
const Support = () => (
  <View style={appStyles.container}>
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
);

export default Support;
