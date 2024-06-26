import React, {useCallback} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../utils/theme';
import VegNonVegTag from '../products/VegNonVegTag';
import {
  CURRENCY_SYMBOLS,
  FB_DOMAIN,
  GROCERY_DOMAIN,
} from '../../utils/constants';

const Provider = ({provider}: {provider: any}) => {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToProviderDetails = () => {
    if (!!provider.items && provider.items.length > 0) {
      const latestItem = provider.items[0];
      const routeParams: any = {
        brandId: latestItem.provider_details.id,
      };

      if (latestItem.location_details) {
        routeParams.outletId = latestItem.location_details.id;
      }
      navigation.navigate('BrandDetails', routeParams);
    }
  };

  const renderItem = useCallback(({item}: {item: any}) => {
    return (
      <View style={styles.product}>
        <FastImage
          source={{uri: item?.item_details?.descriptor?.symbol}}
          style={styles.productImage}
        />
        <View style={styles.productNameContainer}>
          {(item?.context?.domain === GROCERY_DOMAIN ||
            item?.context.domain === FB_DOMAIN) && (
            <View style={styles.vegNonvegContainer}>
              <VegNonVegTag tags={item?.item_details?.tags} showLabel={false} />
            </View>
          )}
          <Text
            variant={'labelLarge'}
            style={styles.productName}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item?.item_details?.descriptor?.name}
          </Text>
        </View>
        <Text variant={'bodyLarge'} style={styles.productAmount}>
          {CURRENCY_SYMBOLS[item?.item_details?.price?.currency]}
          {item?.item_details?.price?.value}
        </Text>
      </View>
    );
  }, []);

  return (
    <TouchableOpacity
      onPress={navigateToProviderDetails}
      style={styles.container}>
      <View style={styles.header}>
        <FastImage
          source={{uri: provider?.descriptor?.symbol}}
          style={styles.image}
        />
        <View style={styles.providerMeta}>
          <Text variant={'titleLarge'} style={styles.providerName}>
            {provider?.descriptor?.name}
          </Text>
          <Text variant={'labelMedium'} style={styles.providerLocality}>
            {provider?.descriptor?.short_desc}
          </Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={provider?.items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      paddingVertical: 12,
      paddingLeft: 16,
      borderWidth: 0.5,
      borderColor: colors.neutral100,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: 48,
      height: 48,
      borderRadius: 8,
      marginRight: 12,
    },
    providerName: {
      marginBottom: 8,
      color: colors.neutral400,
    },
    providerLocality: {
      color: colors.neutral300,
    },
    providerMeta: {
      flex: 1,
    },
    productImage: {
      width: 116,
      height: 116,
      marginBottom: 16,
      borderRadius: 14,
    },
    productNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vegNonvegContainer: {
      marginRight: 8,
    },
    productName: {
      color: colors.neutral400,
    },
    productAmount: {
      color: colors.neutral400,
      marginTop: 8,
    },
    product: {
      marginRight: 24,
      width: 116,
    },
  });

export default Provider;
