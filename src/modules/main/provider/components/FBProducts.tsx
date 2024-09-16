import React, {useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  API_BASE_URL,
  CUSTOM_MENU,
  ITEMS,
  PRODUCT_SEARCH,
} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import CustomMenuAccordion from './CustomMenuAccordion';
import ProductSearch from '../../../../components/products/ProductSearch';
import {getFilterCategory} from '../../../../utils/utils';
import FBFilter from './FBFilter';
import FBProduct from './FBProduct';
import {useAppTheme} from '../../../../utils/theme';
import Menu from '../../../../assets/menu.svg';
import {Portal, Text} from 'react-native-paper';

const CancelToken = axios.CancelToken;
const VegImage = require('../../../../assets/veg.png');
const NonVegImage = require('../../../../assets/non_veg.png');

const FBProducts = ({
  provider,
  domain,
  location,
  isOpen,
}: {
  provider: any;
  domain: string;
  location: string;
  isOpen: boolean;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const customMenuSource = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menu, setMenu] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [menuItem, setMenuItem] = useState<boolean>(false);
  const [defaultExpandVal, setDefaultExpandVal] = useState<number>(0);

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider?.id}&domain=${domain}`,
        customMenuSource.current.token,
      );
      if (data.data.length > 0) {
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
      } else {
        let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=1&limit=500&providerIds=${provider?.id}&locationIds=${location}`;
        const searchedProductsResponse = await getDataWithAuth(
          url,
          customMenuSource.current.token,
        );
        setProducts(searchedProductsResponse.data.response.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setMenuRequested(false);
    }
  };

  const {filteredSections, filteredProducts} = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();

    if (menu.length > 0) {
      // Filter products based on search query
      const list = menu.map(section => {
        let filteredSectionItems = section.items.filter((item: any) => {
          const itemDetails = item?.item_details;
          const itemName = itemDetails?.descriptor?.name?.toLowerCase();
          const categoryId = itemDetails?.category_id;
          const matchesSearch =
            itemName?.includes(lowerSearch) ||
            categoryId?.includes(lowerSearch);
          const matchesFilter =
            selectedFilter.length === 0 ||
            getFilterCategory(itemDetails?.tags) === selectedFilter;
          return matchesSearch && matchesFilter;
        });
        return Object.assign({}, section, {
          items: filteredSectionItems,
        });
      });
      return {
        filteredSections: list.filter(section => section.items.length > 0),
        filteredProducts: [],
      };
    } else {
      return {
        filteredProducts: products.filter((item: any) => {
          const itemDetails = item?.item_details;
          const itemName = itemDetails?.descriptor?.name?.toLowerCase();
          const categoryId = itemDetails?.category_id;
          const matchesSearch =
            itemName?.includes(lowerSearch) ||
            categoryId?.includes(lowerSearch);
          const matchesFilter =
            selectedFilter.length === 0 ||
            getFilterCategory(itemDetails?.tags) === selectedFilter;
          return matchesSearch && matchesFilter;
        }),
        filteredSections: [],
      };
    }
  }, [menu, products, searchQuery, selectedFilter]);

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
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled>
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
        {menu.length > 0 ? (
          filteredSections?.map((section, index) => (
            <CustomMenuAccordion
              key={section.id}
              section={section}
              provider={provider}
              isOpen={isOpen}
              defaultExpand={index === defaultExpandVal}
            />
          ))
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({item}) => (
              <FBProduct product={item} provider={provider} isOpen={isOpen} />
            )}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            keyExtractor={item => item.id}
          />
        )}
      </ScrollView>
      {!menuItem && filteredSections.length > 0 ? (
        <TouchableOpacity
          style={styles.flotingButton}
          onPress={() => setMenuItem(true)}>
          <Menu height={24} width={24} />
          <Text variant="labelMedium" style={styles.menuText}>
            Menu
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <Portal>
        <Modal visible={menuItem} transparent>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.containerModal}
            onPress={() => setMenuItem(false)}>
            <View style={styles.subContainerModal}>
              {filteredSections?.map((section, index) => {
                let itemLength = section?.items?.length;

                return (
                  <TouchableOpacity
                    style={styles.itemModal}
                    onPress={() => {
                      setMenuItem(false);
                      setDefaultExpandVal(index);
                    }}>
                    <Text
                      variant={
                        index === defaultExpandVal
                          ? 'headlineSmall'
                          : 'titleSmall'
                      }
                      style={styles.textmodal}>
                      {section?.descriptor?.name}
                    </Text>
                    <Text
                      variant={
                        index === defaultExpandVal
                          ? 'headlineSmall'
                          : 'titleSmall'
                      }
                      style={styles.textmodal}>
                      {itemLength > 0 ? `${itemLength}` : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {flex: 1},
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
    itemSeparator: {
      marginVertical: 24,
      backgroundColor: colors.neutral100,
      height: 1,
    },
    listContainer: {
      paddingTop: 24,
    },
    itemModal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    menuText: {
      color: colors.white,
    },
    containerModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    subContainerModal: {
      minHeight: 50,
      width: 260,
      backgroundColor: colors.white,
      borderRadius: 16,
      marginBottom: 20,
      marginRight: 20,
      padding: 16,
      gap: 16,
    },
    flotingButton: {
      height: 64,
      width: 64,
      borderRadius: 64,
      backgroundColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    textmodal: {
      color: colors.neutral400,
    },
  });

export default FBProducts;
