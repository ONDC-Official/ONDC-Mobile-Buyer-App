import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, SectionList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  CUSTOM_MENU,
  PRODUCT_SEARCH,
} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import Filters from './Filters';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import Product from '../../modules/main/provider/components/Product';
import {useAppTheme} from '../../utils/theme';
import { useIsFocused } from '@react-navigation/native';
import useWishlistItems from '../../hooks/useWishlistItems';

interface Products {
  providerId: any;
  subCategories: any[];
  searchText: string;
  provider: any;
  providerDomain?: string;
  isOpen: boolean;
}

const CancelToken = axios.CancelToken;

const Products: React.FC<Products> = ({
  providerId = null,
  subCategories = [],
  searchText,
  provider,
  providerDomain,
  isOpen,
}) => {
  const {t} = useTranslation();
  const sectionListRef = useRef<any>(null);
  const productSearchSource = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(true);
  const [searchQuery] = useState<string>('');
  const isFocused = useIsFocused();
  const [page, setPage] = useState<number>(1);
  const {getWishlistItems} = useWishlistItems();
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const [customData, setCustomData] = useState<any>(null);
  const {getDataWithAuth, getDataWithWithoutEncode} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const searchProducts = async (
    pageNumber: number,
    selectedProvider: any,
    customMenu: any,
    subCategoryIds: any,
    attributes: any,
  ) => {
    setMoreListRequested(true);
    try {
      productSearchSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}`;
      url += selectedProvider
        ? `&providerIds=${encodeURIComponent(selectedProvider)}`
        : '';
      url +=
        subCategoryIds.length > 0
          ? `&categoryIds=${encodeURIComponent(subCategoryIds.join(','))}`
          : '';

      Object.keys(attributes).forEach(key => {
        url += `&product_attr_${key}=${attributes[key]
          .map((one: string) => encodeURIComponent(one))
          .join(',')}`;
      });
      url += searchText.length > 0 ? `&name=${searchText}` : '';
      const {data} = await getDataWithWithoutEncode(
        url,
        productSearchSource.current.token,
      );
      if (data.response.data.length > 0) {
        let listData = [];
        if (pageNumber === 1) {
          listData =
            customMenu?.data?.data?.length > 0
              ? customMenu?.data?.data?.map((element: any) => {
                  let makeList: any = [];
                  data.response.data.forEach((item: any) => {
                    if (element?.id === item.customisation_menus[0]?.id) {
                      makeList.push(item);
                    }
                  });
                  return {
                    title: element.descriptor.name,
                    data: [{list: makeList}],
                  };
                })
              : [{title: null, data: [{list: data.response.data}]}];
        } else {
          listData =
            customMenu?.data?.data?.length > 0
              ? customMenu?.data?.data?.map((element: any, index: number) => {
                  let makeList: any = [];
                  data.response.data.forEach((item: any) => {
                    if (element?.id === item.customisation_menus[0]?.id) {
                      makeList.push(item);
                    }
                  });
                  return products.length > 0
                    ? {
                        title: element.descriptor.name,
                        data: [
                          {
                            list: [
                              ...products[index].data[0].list,
                              ...makeList,
                            ],
                          },
                        ],
                      }
                    : {
                        title: element.descriptor.name,
                        data: [{list: makeList}],
                      };
                })
              : products.length > 0
              ? [
                  {
                    title: null,
                    data: [
                      {
                        list: [
                          ...products[0].data[0].list,
                          ...data.response.data,
                        ],
                      },
                    ],
                  },
                ]
              : [{title: null, data: [{list: data.response.data}]}];
        }
        setPage(pageNumber + 1);
        setTotalProducts(data.response.count);
        setProducts([...listData]);
      } else {
        if (pageNumber === 1) {
          setTotalProducts(0);
          setProducts([]);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setMoreListRequested(false);
    }
  };

  useEffect(() => {
    getWishlistItems().then(() => {});
  },[isFocused])

  const loadMoreList = () => {
    if (products?.length > 0) {
      let getCount: number = 0;
      products.forEach(item => {
        getCount = getCount + JSON.parse(item.data[0]?.list?.length);
      });
      if (totalProducts !== getCount) {
        searchProducts(
          page,
          providerId,
          customData,
          subCategories,
          selectedAttributes,
        ).then(() => {});
      }
    }
  };

  const updateSelectedAttributes = (newAttributes: any) => {
    setPage(1);
    setSelectedAttributes(newAttributes);
  };

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    // Filter the products based on the search query

    const list = products.map((item: any) => {
      return {
        title: item.title,
        data: [
          {
            list: item.data[0].list.filter(
              (product: any) =>
                product?.item_details?.descriptor?.name
                  ?.toLowerCase()
                  .includes(lowerQuery) ||
                product?.provider_details?.descriptor?.name
                  ?.toLowerCase()
                  .includes(lowerQuery),
            ),
          },
        ],
      };
    });
    return list.filter(one => one.data[0].list.length > 0);
  }, [products, searchQuery]);

  const renderFlatListItem = useCallback(
    ({item}: {item: any}) => <Product product={item} isOpen={isOpen} />,
    [provider],
  );

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      return item.list.length > 0 ? (
        <FlatList
          data={item.list}
          numColumns={2}
          style={styles.nestedListContainer}
          renderItem={renderFlatListItem}
          keyExtractor={(one: any) => one.id}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : null;
    },
    [renderFlatListItem],
  );

  const renderSectionHeader = useCallback(({section}: any) => {
    return section.data[0]?.list?.length > 0 && section?.title ? (
      <View style={styles.headerSection}>
        <Text variant="headlineSmall" style={styles.headerText}>
          {section?.title}
        </Text>
        <Icon
          name={'keyboard-arrow-right'}
          size={20}
          color={theme.colors.neutral300}
        />
      </View>
    ) : null;
  }, []);

  const ListFooterComponent = useMemo(() => {
    return moreListRequested ? <ProductSkeleton /> : null;
  }, [moreListRequested]);

  useEffect(() => {
    setProducts([]);
    if (sectionListRef?.current) {
      try {
        sectionListRef?.current?.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (providerId) {
      productSearchSource.current = CancelToken.source();
      getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${providerId}${
          providerDomain ? `&domain=${providerDomain}` : ''
        }`,
        productSearchSource.current.token,
      ).then(menu => {
        setCustomData(menu);
        searchProducts(
          1,
          providerId,
          menu,
          subCategories,
          selectedAttributes,
        ).then(() => {});
      });
    } else {
      searchProducts(
        1,
        providerId,
        null,
        subCategories,
        selectedAttributes,
      ).then(() => {});
    }
  }, [providerId, selectedAttributes, subCategories]);

  return (
    <View style={styles.container}>
      <Filters
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={updateSelectedAttributes}
        providerId={providerId}
        category={subCategories.length ? subCategories[0] : null}
      />
      <SectionList
        ref={sectionListRef}
        stickySectionHeadersEnabled={false}
        sections={filteredProducts}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) => `section${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onEndReached={loadMoreList}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={styles.container}
        ListEmptyComponent={() =>
          moreListRequested ? (
            <></>
          ) : (
            <View style={styles.emptyContainer}>
              <Text variant={'bodyMedium'}>
                {t('Home.Search Product WishList.No products available')}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    listContainer: {
      flexGrow: 1,
    },
    nestedListContainer: {
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerSection: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 20,
      paddingHorizontal: 10,
    },
    headerText: {flex: 1},
    columnWrapper: {
      justifyContent: 'space-between',
      gap: 16,
    },
  });

export default Products;
