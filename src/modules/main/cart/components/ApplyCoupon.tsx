import React, {useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../../utils/theme';
import PagerView from 'react-native-pager-view';
import {Text} from 'react-native-paper';

const CouponImg = require('../../../../assets/Coupon.png');

interface Offers {}

const data = false;

const ApplyCoupon: React.FC<Offers> = ({}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selectedMediaPosition, setSelectedMediaPosition] = useState(0);

  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return data ? (
    <View style={styles.CouponMainView}>
      <PagerView
        onPageSelected={({nativeEvent: {position}}) =>
          setSelectedMediaPosition(position)
        }
        initialPage={0}>
        {[{}, {}, {}].map((item, index) => (
          <View key={index} style={styles.cardView}>
            <View style={styles.leftView}>
              <Image source={CouponImg} />
            </View>
            <View style={styles.rightView}>
              <View style={styles.rightInnerView}>
                <Text variant="titleLarge">FLAT 50% OFF</Text>
                <Text variant="labelSmall" style={styles.title}>
                  Use code kotak50
                </Text>
              </View>
              <Text variant="bodyLarge" style={styles.removeText}>
                Remove
              </Text>
            </View>
          </View>
        ))}
      </PagerView>
      <View style={styles.pageIndicator}>
        {[{}, {}, {}].map((item, index) => (
          <View
            key={`${index}dot`}
            style={
              index === selectedMediaPosition ? styles.selectedDot : styles.dot
            }
          />
        ))}
      </View>

      <Text variant="bodyMedium" style={styles.viewAllText}>
        View All Coupons
      </Text>
    </View>
  ) : (
    <View style={styles.applyCouponView}>
      <View style={styles.leftSideView}>
        <Image style={styles.icon} source={CouponImg} />
        <Text variant="bodyLarge" style={styles.applyText}>
          Apply Coupon
        </Text>
      </View>
      <Text
        variant="bodyLarge"
        style={styles.select}
        onPress={() => navigation.navigate('CouponList')}>
        Select
      </Text>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 24,
      paddingHorizontal: 20,
      gap: 20,
    },
    cardView: {
      flex: 1,
      height: 64,
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.neutral100,
    },
    title: {
      fontWeight: '400',
    },
    leftView: {
      height: 64,
      width: 64,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary50,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    pageIndicator: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      bottom: 0,
      marginTop: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.neutral100,
    },
    selectedDot: {
      width: 24,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.primary,
    },
    rightView: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 12,
      gap: 2,
      flexDirection: 'row',
    },
    rightInnerView: {
      flex: 1,
    },
    applyCouponView: {
      height: 56,
      backgroundColor: colors.white,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    CouponMainView: {
      backgroundColor: colors.white,
      padding: 20,
    },
    leftSideView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      height: 32,
      width: 32,
    },
    applyText: {
      marginLeft: 8,
    },
    viewAllText: {
      width: '100%',
      textAlign: 'right',
      marginTop: 20,
    },
    removeText: {
      color: colors.error600,
    },
    select: {
      color: colors.primary,
    },
  });

export default ApplyCoupon;
