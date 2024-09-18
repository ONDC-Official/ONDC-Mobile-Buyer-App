import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import 'moment-duration-format';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../../../utils/theme';
import DeleteWishlist from '../../../../assets/delete_wishlist.svg';

interface WishlistItem {
  item: any;
  deleteWishlist: (values: any) => void;
}
const NoImageAvailable = require('../../../../assets/noImage.png');

const WishlistItem: React.FC<WishlistItem> = ({item, deleteWishlist}) => {
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
              uri: item?.items[0]?.provider_details?.descriptor?.symbol,
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <View style={styles.titleView}>
              <Text variant="titleLarge" style={styles.title} numberOfLines={1}>
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
        <ScrollView
          contentContainerStyle={styles.itemMainView}
          showsHorizontalScrollIndicator={false}>
          {item?.items.map((one: any, index: number) => {
            let imageSource = NoImageAvailable;
            if (one?.item_details?.descriptor?.symbol) {
              imageSource = {uri: one?.item_details?.descriptor?.symbol};
            } else if (one?.item_details?.descriptor?.images?.length > 0) {
              imageSource = {uri: one?.item_details?.descriptor?.images[0]};
            }
            return (
              <View style={styles.itemSubView}>
                <View style={styles.itemView}>
                  <FastImage source={imageSource} style={styles.itemImage} />
                  <View style={styles.itemTextView}>
                    <Text
                      variant="labelLarge"
                      style={styles.neutral400}
                      numberOfLines={1}>
                      {one?.item_details?.descriptor?.name}
                    </Text>
                    <Text variant="labelLarge" style={styles.neutral400}>
                      ₹{one?.item_details?.price?.value}
                    </Text>
                  </View>
                </View>
                <View style={styles.iconView}>
                  <DeleteWishlist
                    height={18}
                    width={16}
                    color={theme.colors.error600}
                  />
                  <MaterialCommunityIcons
                    name={'cart-plus'}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
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
      gap: 16,
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
    itemMainView: {
      gap: 16,
    },
    itemSubView: {flex: 1, flexDirection: 'row', gap: 32},
    itemView: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    itemTextView: {
      flex: 1,
      gap: 8,
    },
    itemImage: {
      height: 68,
      width: 68,
      borderRadius: 8,
    },
    neutral400: {
      color: colors.neutral400,
    },
    iconView: {
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
    },
  });

export default WishlistItem;
