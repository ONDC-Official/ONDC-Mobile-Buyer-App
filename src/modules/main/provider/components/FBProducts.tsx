import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios/index';
import {API_BASE_URL, CUSTOM_MENU, ITEMS} from '../../../../utils/apiActions';
import {List, Text, useTheme} from 'react-native-paper';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface FBProducts {
  provider: string;
  domain: string;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const CancelToken = axios.CancelToken;
const FBProducts: React.FC<FBProducts> = ({provider, domain}) => {
  const customMenuSource = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider}&domain=${domain}`,
        customMenuSource.current.token,
      );
      const menuResponses = await Promise.all(
        data.data.map((one: any) =>
          getDataWithAuth(
            `${API_BASE_URL}${ITEMS}?customMenu=${one.id}`,
            customMenuSource.current.token,
          ),
        ),
      );
      setMenu(
        data.data.map((one: any, index: number) => {
          one.items = menuResponses[index].data.data;
          return one;
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setMenuRequested(false);
    }
  };

  useEffect(() => {
    getCustomMenu().then(() => {});

    return () => {
      if (customMenuSource.current) {
        customMenuSource.current.cancel();
      }
    };
  }, []);

  if (menuRequested) {
    return (
      <>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </>
    );
  }

  return menu.map(section => {
    const itemLength = section?.items?.length;
    return (
      <List.Accordion
        key={section?.id}
        title={
          <Text variant={'titleMedium'}>
            {section?.descriptor?.name}{' '}
            {section?.items ? `(${section?.items?.length})` : ''}
          </Text>
        }>
        {section?.items?.map((item: any, index: number) => (
          <TouchableOpacity key={item?.item_details?.id} style={styles.product}>
            <View style={styles.item}>
              <View style={styles.meta}>
                <Text variant={'titleSmall'} style={styles.field}>
                  {item?.item_details?.descriptor?.name}
                </Text>
                <Text variant={'titleMedium'} style={styles.field}>
                  {CURRENCY_SYMBOLS[item?.item_details?.price?.currency]}{' '}
                  {item?.item_details?.price?.value}
                </Text>
                <Text variant={'bodyMedium'} style={styles.field}>
                  {item?.item_details?.descriptor?.short_desc}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <FastImage
                  style={styles.image}
                  source={
                    item?.item_details?.descriptor.symbol
                      ? {uri: item?.item_details?.descriptor.symbol}
                      : NoImageAvailable
                  }
                />
                <TouchableOpacity style={styles.addButton}>
                  <Text variant={'titleSmall'} style={styles.addText}>
                    Add
                  </Text>
                  <Icon name={'plus'} color={theme.colors.primary} size={16} />
                </TouchableOpacity>
              </View>
            </View>
            {itemLength === index + 1 ? (
              <View style={styles.lastItem} />
            ) : (
              <View style={styles.itemSeparator} />
            )}
          </TouchableOpacity>
        ))}
      </List.Accordion>
    );
  });
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    product: {
      paddingHorizontal: 16,
    },
    item: {
      flexDirection: 'row',
    },
    meta: {
      flex: 1,
    },
    imageContainer: {
      width: 126,
      alignItems: 'center',
    },
    image: {
      width: 126,
      height: 126,
      borderRadius: 15,
      background: '#F5F5F5',
      marginBottom: 12,
    },
    field: {
      marginBottom: 12,
    },
    itemSeparator: {
      marginVertical: 24,
      backgroundColor: '#E0E0E0',
      height: 1,
    },
    lastItem: {
      marginBottom: 24,
    },
    addText: {
      color: colors.primary,
    },
    addButton: {
      width: 90,
      borderRadius: 8,
      borderColor: colors.primary,
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

export default FBProducts;
