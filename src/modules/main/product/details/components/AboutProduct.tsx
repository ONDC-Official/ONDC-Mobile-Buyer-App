import {List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import {useAppTheme} from '../../../../../utils/theme';

const AboutProduct = ({product}: {product: any}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [expanded, setExpanded] = useState<boolean>(true);

  const handleAccordionPress = () => setExpanded(!expanded);

  const renderItemDetails = () => {
    let returnWindowValue: string = '0';
    if (product.item_details?.['@ondc/org/return_window']) {
      // Create a duration object from the ISO 8601 string
      const duration = moment.duration(
        product.item_details?.['@ondc/org/return_window'],
      );

      // Get the number of hours from the duration object
      returnWindowValue = duration.humanize();
    }

    const data: any = {
      'Available on COD':
        product.item_details?.['@ondc/org/available_on_cod']?.toString() ===
        'true'
          ? 'Yes'
          : 'No',
      Cancellable:
        product.item_details?.['@ondc/org/cancellable']?.toString() === 'true'
          ? 'Yes'
          : 'No',
      'Return window value': returnWindowValue,
      Returnable:
        product.item_details?.['@ondc/org/returnable']?.toString() === 'true'
          ? 'Yes'
          : 'No',
      'Customer care':
        product.item_details?.['@ondc/org/contact_details_consumer_care'],
      'Manufacturer name':
        product.item_details?.['@ondc/org/statutory_reqs_packaged_commodities']
          ?.manufacturer_or_packer_name,
      'Manufacturer address':
        product.item_details?.['@ondc/org/statutory_reqs_packaged_commodities']
          ?.manufacturer_or_packer_address,
    };

    return Object.keys(data).map(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        return (
          <View style={styles.aboutRow} key={key}>
            <Text variant="bodyLarge" style={styles.aboutTitle}>
              {key}
            </Text>
            <View style={styles.aboutSeparator} />
            <Text variant="bodyMedium" style={styles.aboutDetails}>
              {value}
            </Text>
          </View>
        );
      }
      return <View key={key} />; // Return null for fields with null or undefined values
    });
  };

  return (
    <View style={styles.aboutContainer}>
      <List.Accordion
        expanded={expanded}
        onPress={handleAccordionPress}
        title={
          <Text variant={'titleSmall'} style={styles.about}>
            About
          </Text>
        }>
        {Object.keys(product?.attributes).map(key => (
          <View style={styles.aboutRow} key={key}>
            <Text variant="bodyLarge" style={styles.aboutTitle}>
              {key}
            </Text>
            <View style={styles.aboutSeparator} />
            <Text variant="bodyMedium" style={styles.aboutDetails}>
              {product?.attributes[key]}
            </Text>
          </View>
        ))}
        {renderItemDetails()}
      </List.Accordion>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    about: {
      color: '#222',
    },
    aboutContainer: {},
    aboutRow: {
      flexDirection: 'row',
      marginBottom: 30,
    },
    aboutTitle: {
      width: 130,
      color: '#787A80',
      textTransform: 'capitalize',
    },
    aboutSeparator: {
      width: 28,
    },
    aboutDetails: {
      flex: 1,
      color: '#1D1D1D',
    },
  });

export default AboutProduct;
