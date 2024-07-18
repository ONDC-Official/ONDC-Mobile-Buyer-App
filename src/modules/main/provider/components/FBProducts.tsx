import React, {useEffect, useMemo, useRef, useState} from 'react';
import {List, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {API_BASE_URL, CUSTOM_MENU, ITEMS} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import CustomMenuAccordion from './CustomMenuAccordion';
import {useAppTheme} from '../../../../utils/theme';
import ProductSearch from '../../../../components/products/ProductSearch';

const CancelToken = axios.CancelToken;
const VegImage = require('../../../../assets/veg.png');
const NonVegImage = require('../../../../assets/non_veg.png');

const FBProducts = ({provider, domain}: {provider: string; domain: string}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const customMenuSource = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [expandedAccordionId, setExpandedAccordionId] = useState<
    string | number
  >('');
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
      const list = data.data.map((one: any, index: number) => {
        one.items = menuResponses[index].data.data;
        return one;
      });
      if (list.length > 0) {
        setExpandedAccordionId(list[0].id);
      }
      setMenu(list);
    } catch (error) {
      handleApiError(error);
    } finally {
      setMenuRequested(false);
    }
  };

  const filteredSections = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    // Filter products based on search query
    return menu.map(section => {
      const filteredSectionItems = section.items.filter(
        (item: any) =>
          item.item_details?.descriptor?.name
            .toLowerCase()
            .includes(lowerSearch) ||
          item?.item_details?.category_id.includes(lowerSearch),
      );
      return Object.assign({}, section, {
        items: filteredSectionItems,
      });
    });
  }, [menu, searchQuery]);

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

  return (
    <View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'veg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'veg'
              ? setSelectedFilter('')
              : setSelectedFilter('veg')
          }>
          <FastImage source={VegImage} style={styles.filterIcon} />
          <Text variant={'bodyMedium'} style={styles.filterLabel}>
            {t('Cart.Veg')}
          </Text>
          {selectedFilter === 'veg' && (
            <Icon
              name={'clear'}
              size={20}
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'nonveg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'nonveg'
              ? setSelectedFilter('')
              : setSelectedFilter('nonveg')
          }>
          <FastImage
            source={NonVegImage}
            style={styles.filterIcon}
          />
          <Text variant={'bodyMedium'} style={styles.filterLabel}>
            {t('Cart.Non Veg')}
          </Text>
          {selectedFilter === 'nonveg' && (
            <Icon
              name={'clear'}
              size={20}
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'egg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'egg'
              ? setSelectedFilter('')
              : setSelectedFilter('egg')
          }>
          <FastImage
            source={NonVegImage}
            style={styles.filterIcon}
          />
          <Text variant={'bodyMedium'} style={styles.filterLabel}>
            {t('Cart.Egg')}
          </Text>
          {selectedFilter === 'egg' && (
            <Icon
              name={'clear'}
              size={20}
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      <List.AccordionGroup
        expandedId={expandedAccordionId}
        onAccordionPress={expandedId => setExpandedAccordionId(expandedId)}>
        {filteredSections.map(section => (
          <CustomMenuAccordion
            key={section.id}
            section={section}
            selectedFilter={selectedFilter}
          />
        ))}
      </List.AccordionGroup>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: 16,
      marginTop: 24,
    },
    filter: {
      borderRadius: 60,
      backgroundColor: colors.neutral100,
      borderWidth: 1,
      borderColor: colors.neutral100,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 7,
    },
    selectedFilter: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary,
    },
    filterIcon: {
      width: 18,
      height: 18,
    },
    filterLabel: {
      color: colors.neutral400,
      marginLeft: 4,
    },
    icon: {
      marginLeft: 12,
    },
    searchContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
  });

export default FBProducts;
