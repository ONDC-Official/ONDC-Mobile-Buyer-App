import {List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import 'moment-duration-format';
import {useAppTheme} from '../../../../../utils/theme';
import useMinutesToString from '../../../../../hooks/useMinutesToString';

const AboutProduct = ({product, inStock}: {product: any; inStock: boolean}) => {
  const {t} = useTranslation();
  const {convertDurationToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const attributes = useMemo(() => {
    if (product) {
      let returnWindowValue: string = '0';
      if (product.item_details?.['@ondc/org/return_window']) {
        const time = convertDurationToHumanReadable(
          product.item_details?.['@ondc/org/return_window'],
        );
        returnWindowValue = translateMinutesToHumanReadable(
          time.type,
          time.time,
        );
      }

      const returnable =
        product.item_details?.['@ondc/org/returnable']?.toString() === 'true';

      let data: any = {
        'Available on COD':
          product.item_details?.['@ondc/org/available_on_cod']?.toString() ===
          'true'
            ? 'Yes'
            : 'No',
        Cancellable:
          product.item_details?.['@ondc/org/cancellable']?.toString() === 'true'
            ? 'Yes'
            : 'No',
        Returnable: returnable ? 'Yes' : 'No',
        'Customer care':
          product.item_details?.['@ondc/org/contact_details_consumer_care'],
        'Manufacturer name':
          product.item_details?.[
            '@ondc/org/statutory_reqs_packaged_commodities'
          ]?.manufacturer_or_packer_name,
        'Manufacturer address':
          product.item_details?.[
            '@ondc/org/statutory_reqs_packaged_commodities'
          ]?.manufacturer_or_packer_address,
        Description: product.item_details?.descriptor?.long_desc ?? '',
      };

      if (returnable) {
        data['Returnable in'] = returnWindowValue;
      }

      data = Object.assign({}, data, product?.attributes);

      return data;
    }

    return {};
  }, [product]);

  return (
    <View>
      <List.Accordion
        style={styles.listHeader}
        title={
          <Text
            variant={'titleLarge'}
            style={[styles.about, inStock ? {} : styles.disabledText]}>
            {t('Cart.Product Details')}
          </Text>
        }>
        <View style={styles.details}>
          {Object.keys(attributes).map(key => (
            <View style={styles.aboutRow} key={key}>
              <Text variant="bodyMedium" style={styles.aboutTitle}>
                {key}
              </Text>
              <View style={styles.aboutSeparator} />
              <Text
                variant="bodyMedium"
                style={[
                  styles.aboutDetails,
                  inStock ? {} : styles.disabledText,
                ]}>
                {attributes[key]}
              </Text>
            </View>
          ))}
        </View>
      </List.Accordion>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    about: {
      color: colors.neutral400,
    },
    disabledText: {
      color: colors.neutral300,
    },
    aboutRow: {
      flexDirection: 'row',
      marginBottom: 30,
      alignItems: 'flex-start',
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
    details: {
      paddingTop: 12,
      paddingHorizontal: 16,
    },
    listHeader: {backgroundColor: colors.white},
  });

export default AboutProduct;
