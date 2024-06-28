import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useAppTheme} from '../../../../../utils/theme';
import {DateTime, Duration} from 'luxon';
import {format, differenceInDays, parseISO, differenceInHours} from 'date-fns';
import {toZonedTime} from 'date-fns-tz';

const AboutProduct = ({product, inStock}: {product: any; inStock: boolean}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [menuClose, setMenuClose] = useState<boolean>(true);
  const height = useSharedValue(0);

  const convertP2DToISO8601 = (
    durationString: string,
    baseDate = new Date(),
  ) => {
    // Parse the duration string using Luxon's Duration class
    const duration = Duration.fromISO(durationString);

    // Add the duration to the base date
    const resultDate = DateTime.fromJSDate(baseDate).plus(duration);

    // Return the resulting date in ISO 8601 format
    return resultDate.toISO();
  };

  const attributes = useMemo(() => {
    if (product) {
      let returnWindowValue: string = '0';
      console.log('date : ', product.item_details?.['@ondc/org/return_window']);

      if (product.item_details?.['@ondc/org/return_window']) {
        const baseDate = new Date(); // You can use a specific date if needed

        const iso8601Date = convertP2DToISO8601(
          product.item_details?.['@ondc/org/return_window'],
          baseDate,
        );
        console.log('iso8601Date :: ', iso8601Date);
        const timeZone = 'Asia/Kolkata'; // Time zone

        // Convert the date to the desired time zone
        const zonedDate = toZonedTime(iso8601Date, timeZone);

        // Format the date in the desired format
        const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        console.log('formattedDate :: ', formattedDate);
        const currentDate = new Date();
        const targetDate = formattedDate;

        // Parse the target date to a Date object
        const parsedTargetDate = parseISO(targetDate);

        // Calculate the difference in days
        const difference = differenceInDays(parsedTargetDate, currentDate);
        // const hoursDifference = differenceInHours(parsedTargetDate, currentDate) % 24;

        // if(difference > 0){
        returnWindowValue = `In ${difference} Days`;
        // }else{
        //   returnWindowValue = `In ${hoursDifference} Hours`;
        // }

        console.log(difference); // Output: ISO 8601 formatted date
      }

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
        'Return window value': returnWindowValue,
        Returnable:
          product.item_details?.['@ondc/org/returnable']?.toString() === 'true'
            ? 'Yes'
            : 'No',
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
      };

      data = Object.assign({}, data, product?.attributes);

      return data;
    }

    return {};
  }, [product]);

  const toggleAccordion = () => {
    setMenuClose(!menuClose);
    if (!menuClose) {
      height.value = withSpring(0); // Open accordion
    } else {
      height.value = withSpring(Object.keys(attributes).length * 60); // Close accordion
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleAccordion}>
        <Text
          variant={'titleLarge'}
          style={[styles.about, inStock ? {} : styles.disabledText]}>
          {t('Cart.Product Details')}
        </Text>
        <Icon
          name={menuClose ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
          size={24}
          color={theme.colors.neutral400}
        />
      </TouchableOpacity>
      {!menuClose && (
        <Animated.View style={[styles.details, animatedStyle]}>
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
        </Animated.View>
      )}
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
    accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 28,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    details: {
      paddingTop: 12,
    },
  });

export default AboutProduct;
