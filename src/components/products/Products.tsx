import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, View, SectionList} from 'react-native';
import {useSelector} from 'react-redux';
import {ProgressBar, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';

import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  PRODUCT_SEARCH,
  CUSTOM_MENU,
} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import Filters from './Filters';
import {
  compareIgnoringSpaces,
  showToastWithGravity,
  skeletonList,
} from '../../utils/utils';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import Product from '../../modules/main/provider/components/Product';
import {useAppTheme} from '../../utils/theme';
import ProductSearch from './ProductSearch';
import useReadAudio from '../../hooks/useReadAudio';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Products {
  providerId: any;
  subCategories: any[];
  search?: boolean;
  provider: any;
  setMinTimeToShipMinutes: (value: number) => void;
  setMaxTimeToShipMinutes: (value: number) => void;
  providerDomain: string;
}

const CancelToken = axios.CancelToken;

const Products: React.FC<Products> = ({
  providerId = null,
  subCategories = [],
  search = false,
  provider,
  setMinTimeToShipMinutes,
  setMaxTimeToShipMinutes,
  providerDomain,
}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {language} = useSelector(({auth}) => auth);
  const {t} = useTranslation();
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const [customData, setCustomData] = useState<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
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
      url += selectedProvider ? `&providerIds=${selectedProvider}` : '';
      url +=
        subCategoryIds.length > 0
          ? `&categoryIds=${subCategoryIds.join(',')}`
          : '';
      Object.keys(attributes).map(key => {
        url += `&${key}=${attributes[key].join(',')}`;
      });

      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      let maxMinutes = 0;
      let minMinutes = 999999;
      data.response.data.forEach((item: any) => {
        const duration = moment.duration(
          item?.item_details['@ondc/org/time_to_ship'],
        );
        let durationInMinutes = duration.format('m').replace(/\,/g, '');

        if (maxMinutes < durationInMinutes) {
          maxMinutes = durationInMinutes;
        }
        if (minMinutes > durationInMinutes) {
          minMinutes = durationInMinutes;
        }
      });
      if (data.response.data.length > 0) {
        setPage(page + 1);
        setMaxTimeToShipMinutes(maxMinutes);
        setMinTimeToShipMinutes(minMinutes);
        setTotalProducts(data.response.count);

        const listData = customMenu?.data?.data?.map(
          (element: any, index: number) => {
            let makeList: any = [];
            data.response.data.forEach((item: any) => {
              if (element.id === item.customisation_menus[0].id) {
                makeList.push(item);
              }
            });
            return products.length > 0
              ? {
                  title: element.descriptor.name,
                  data: [
                    {list: [...products[index].data[0].list, ...makeList]},
                  ],
                }
              : {title: element.descriptor.name, data: [{list: makeList}]};
          },
        );

        setProducts([...listData]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setMoreListRequested(false);
    }
  };

  const loadMoreList = () => {
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
      ).then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    }
  };

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    // Filter the products based on the search query

    const listData = products.map((item: any) => {
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

    return listData;
  }, [products, searchQuery]);

  useEffect(() => {
    (async () => {
      if (providerId) {
        productSearchSource.current = CancelToken.source();
        const customdMenu = await getDataWithAuth(
          `${API_BASE_URL}${CUSTOM_MENU}?provider=${providerId}&domain=${providerDomain}`,
          productSearchSource.current.token,
        );
        setCustomData(customdMenu);

        searchProducts(
          page,
          providerId,
          customdMenu,
          subCategories,
          selectedAttributes,
        ).then(() => {
          voiceDetectionStarted.current = true;
          startVoice().then(() => {});
        });
      }
    })();
  }, [providerId, selectedAttributes]);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (/^(select|choose)\b/i.test(input)) {
        const productName = input
          .replace('select', '')
          .replace('choose', '')
          .trim();
        let selectedProducts = [];
        selectedProducts = products.filter(product =>
          compareIgnoringSpaces(
            product?.item_details?.descriptor?.name.toLowerCase(),
            productName,
          ),
        );
        if (selectedProducts.length > 1) {
          showToastWithGravity(
            'There are more than 1 product, please provide more details',
          );
        } else {
          const product = selectedProducts[0];
          stopAndDestroyVoiceListener().then(() => {
            navigation.navigate('ProductDetails', {productId: product.id});
          });
        }
      } else if (compareIgnoringSpaces('go to cart', input)) {
        stopAndDestroyVoiceListener().then(() => {
          navigation.navigate('Cart');
        });
      }
    }
  }, [userInput, products]);

  useFocusEffect(
    useCallback(() => {
      if (voiceDetectionStarted.current) {
        setAllowRestarts();
      }
    }, []),
  );

  return (
    <View style={styles.container}>
      {userInteractionStarted && (
        <ProgressBar indeterminate color={theme.colors.success600} />
      )}
      <Filters
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        providerId={providerId}
        category={subCategories.length ? subCategories[0] : null}
      />
      <View style={styles.searchContainer}>
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      <SectionList
        sections={filteredProducts}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => {
          return item.list.length > 0 ? (
            <FlatList
              data={item.list}
              numColumns={2}
              style={styles.nestedListContainer}
              renderItem={({item}) => {
                return (
                  <View key={item.id} style={styles.productContainer}>
                    <Product
                      product={item}
                      search={search}
                      provider={provider}
                    />
                  </View>
                );
              }}
              keyExtractor={({item, index}) => index}
            />
          ) : (
            <></>
          );
        }}
        renderSectionHeader={({section}) => {
          return section.data[0]?.list?.length > 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingBottom: 20,
                paddingHorizontal: 10,
              }}>
              <Text variant="headlineSmall" style={{flex: 1}}>
                {section?.title}
              </Text>
              <Icon
                name={'keyboard-arrow-right'}
                size={20}
                color={theme.colors.neutral300}
              />
            </View>
          ) : (
            <></>
          );
        }}
        onEndReached={loadMoreList}
        ListFooterComponent={props =>
          moreListRequested ? <ProductSkeleton /> : <></>
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
    productContainer: {
      width: '50%',
      height: 254,
      marginBottom: 12,
    },
    searchContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    searchBar: {
      borderRadius: 60,
      height: 40,
    },
    searchInput: {
      paddingVertical: 0,
    },
    listContainer: {
      flexGrow: 1,
      paddingHorizontal: 8,
      marginTop: 24,
    },
    nestedListContainer: {
      flexGrow: 1,
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Products;
