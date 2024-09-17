import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import 'moment-duration-format';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppTheme} from '../../../../../utils/theme';
import {getPriceWithCustomisations} from '../../../../../utils/utils';
import useFormatNumber from '../../../../../hooks/useFormatNumber';

interface StoreCart {
  item: any;
  index: number;
  deleteStore: (values: any) => void;
  goToViewCart: (values: any) => void;
}

const NoImageAvailable = require('../../../../../assets/noImage.png');

const StoreCart: React.FC<StoreCart> = ({
  item,
  index,
  deleteStore,
  goToViewCart,
}) => {
  const {t} = useTranslation();
  const {formatNumber} = useFormatNumber();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const [cartTotal, setCartTotal] = useState<number>(0);
  const [locality, setLocality] = useState<string>('');
  const [itemsCart, setItemsCart] = useState<string>('');

  useEffect(() => {
    if (item) {
      let itemsLocality = '';
      let total = 0;
      let description: any = '';

      item?.items.forEach((one: any, ind: number) => {
        if (one.item.hasCustomisations) {
          total += getPriceWithCustomisations(one) * one?.item?.quantity?.count;
        } else {
          total += one?.item?.product?.subtotal * one?.item?.quantity?.count;
        }
        itemsLocality = one.item.location_details?.address?.locality;
        description = description + one?.item?.product?.descriptor?.name;

        if (item?.items.length - 2 !== ind || item?.items.length === 1) {
          if (item?.items.length - 1 !== ind) {
            description = description + ', ';
          }
        } else {
          description = description + ' and ';
        }
      });
      setItemsCart(description);
      setCartTotal(total);
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
                onPress={() => deleteStore(item?._id)}>
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
        <View>
          <Text variant="labelLarge" style={styles.itemCart}>
            {t('Cart.Items in cart', {count: item?.items.length})}
          </Text>

          <ScrollView
            contentContainerStyle={styles.itemMainView}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {item?.items.map((one: any, index: number) => {
              let imageSource = NoImageAvailable;
              if (one?.item?.product?.descriptor?.symbol) {
                imageSource = {uri: one?.item?.product?.descriptor?.symbol};
              } else if (one?.item?.product?.descriptor?.images?.length > 0) {
                imageSource = {uri: one?.item?.product?.descriptor?.images[0]};
              }

              return (
                <View key={one._id} style={styles.cartItem}>
                  <FastImage source={imageSource} style={styles.itemImage} />
                </View>
              );
            })}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text
              variant="labelMedium"
              style={styles.description}
              numberOfLines={1}>
              {itemsCart}
            </Text>
          </ScrollView>
        </View>
        {/* bottomView */}
        <View style={styles.bottomView}>
          <Text variant="bodyLarge">
            {t('Cart.Total')}: ₹{formatNumber(Number(cartTotal.toFixed(2)))}
          </Text>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => goToViewCart(index)}>
            <Text variant="labelLarge" style={styles.buttonText}>
              {t('Cart.View Cart')}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={16}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
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
    cartItem: {
      width: 40,
    },
    headerImage: {
      height: 48,
      width: 48,
      borderRadius: 8,
    },
    itemImage: {
      height: 40,
      width: 40,
      borderRadius: 12,
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
    description: {
      color: colors.neutral400,
    },
    itemCart: {
      color: colors.neutral400,
    },
    itemMainView: {
      flexDirection: 'row',
      paddingVertical: 8,
      gap: 8,
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewCartButton: {
      flexDirection: 'row',
      height: 32,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    buttonText: {
      color: colors.white,
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
    distance: {
      color: colors.neutral300,
    },
    imageIcon: {marginRight: 5},
    dotView: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
  });

export default StoreCart;
