import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import 'moment-duration-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppTheme} from '../../../../utils/theme';

interface WishlistItem {
  item: any;
  index: number;
  deleteWishlist: (values: any) => void;
}

const WishlistItem: React.FC<WishlistItem> = ({
  item,
  index,
  deleteWishlist,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const [locality, setLocality] = useState<string>('');

  useEffect(() => {
    if (item) {
      let itemsLocality = '';

      item?.items.forEach((one: any, ind: number) => {
        itemsLocality = one.location_details?.address?.locality;
      });
      setLocality(itemsLocality);
    }
  }, [item]);

  return (
    <View>
      <View style={styles.mainItemView}>
        {/* header */}
        <View style={styles.itemHeader}>
          <FastImage
            source={{
              uri: item?.items[0]?.item?.provider?.descriptor?.symbol,
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <View style={styles.titleView}>
              <Text variant="titleLarge" style={styles.title}>
                {item?.location?.provider_descriptor?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => deleteWishlist(item?._id)}>
                <MaterialCommunityIcons
                  name={'close-circle-outline'}
                  size={24}
                  color={theme.colors.neutral400}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.providerLocalityView}>
              <Text
                variant={'labelSmall'}
                style={styles.providerLocality}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {locality}
              </Text>
            </View>
          </View>
        </View>

        {/* line */}
        <View style={styles.line} />

        {/* items */}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    mainItemView: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      padding: 12,
      gap: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      gap: 12,
    },
    headerImage: {
      height: 48,
      width: 48,
      borderRadius: 8,
    },
    headerText: {
      flex: 1,
      height: 42,
      justifyContent: 'space-between',
    },
    line: {height: 1, backgroundColor: colors.neutral100},
    titleView: {
      flexDirection: 'row',
    },
    title: {
      flex: 1,
      color: colors.neutral400,
    },
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerLocality: {
      color: colors.neutral300,
      flexShrink: 1,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default WishlistItem;
