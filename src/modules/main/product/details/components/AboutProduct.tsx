import {List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const AboutProduct = ({product}: {product: any}) => {
  const {t} = useTranslation();
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
            <Text variant="bodyMedium" style={styles.aboutTitle}>
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
    <List.Accordion
      expanded={expanded}
      left={() => <></>}
      onPress={handleAccordionPress}
      title={
        <Text variant={'titleLarge'} style={styles.about}>
          {t('Cart.Product Details')}
        </Text>
      }>
      <View style={styles.accordionContainer}>
        {Object.keys(product?.attributes).map(key => (
          <View style={styles.aboutRow} key={key}>
            <Text variant="bodyMedium" style={styles.aboutTitle}>
              {key}
            </Text>
            <View style={styles.aboutSeparator} />
            <Text variant="bodyMedium" style={styles.aboutDetails}>
              {product?.attributes[key]}
            </Text>
          </View>
        ))}
        {renderItemDetails()}
      </View>
    </List.Accordion>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    about: {
      color: colors.neutral400,
    },
    accordionContainer: {
      paddingLeft: 0,
    },
    aboutRow: {
      flexDirection: 'row',
      marginBottom: 30,
      alignItems: 'flex-start',
      flex: 1,
    },
    aboutTitle: {
      width: 130,
      color: colors.neutral300,
      textTransform: 'capitalize',
      textAlign: 'left',
    },
    aboutSeparator: {
      width: 28,
    },
    aboutDetails: {
      flex: 1,
      color: colors.neutral400,
    },
  });

export default AboutProduct;
