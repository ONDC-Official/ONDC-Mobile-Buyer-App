import React, {useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {API_BASE_URL, CUSTOM_MENU, ITEMS} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import CustomMenuAccordion from './CustomMenuAccordion';
import ProductSearch from '../../../../components/products/ProductSearch';
import {getFilterCategory} from '../../../../utils/utils';
import FBFilter from './FBFilter';

const CancelToken = axios.CancelToken;
const VegImage = require('../../../../assets/veg.png');
const NonVegImage = require('../../../../assets/non_veg.png');

const FBProducts = ({
  provider,
  domain,
  location,
}: {
  provider: any;
  domain: string;
  location: string;
}) => {
  const {t} = useTranslation();
  const styles = makeStyles();
  const customMenuSource = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider?.id}&domain=${domain}`,
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
    const list = menu.map(section => {
      let filteredSectionItems = section.items.filter((item: any) => {
        const itemDetails = item?.item_details;
        const itemName = itemDetails?.descriptor?.name?.toLowerCase();
        const categoryId = itemDetails?.category_id;
        const matchesSearch =
          itemName?.includes(lowerSearch) || categoryId?.includes(lowerSearch);
        const matchesFilter =
          selectedFilter.length === 0 ||
          getFilterCategory(itemDetails?.tags) === selectedFilter;
        return matchesSearch && matchesFilter;
      });
      return Object.assign({}, section, {
        items: filteredSectionItems,
      });
    });
    return list.filter(section => section.items.length > 0);
  }, [menu, searchQuery, selectedFilter]);

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
        <FBFilter
          selectedFilter={selectedFilter}
          label={t('Cart.Veg')}
          value={'veg'}
          setSelectedFilter={setSelectedFilter}
          imageSource={VegImage}
        />
        <FBFilter
          selectedFilter={selectedFilter}
          label={t('Cart.Non Veg')}
          value={'nonveg'}
          setSelectedFilter={setSelectedFilter}
          imageSource={NonVegImage}
        />
        <FBFilter
          selectedFilter={selectedFilter}
          label={t('Cart.Egg')}
          value={'egg'}
          setSelectedFilter={setSelectedFilter}
          imageSource={NonVegImage}
        />
      </View>
      <View style={styles.searchContainer}>
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      {filteredSections.map((section, index) => (
        <CustomMenuAccordion
          key={section.id}
          section={section}
          provider={provider}
          defaultExpand={index === 0}
        />
      ))}
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: 16,
      marginTop: 24,
    },
    searchContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
  });

export default FBProducts;
