import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useTranslation} from 'react-i18next';
import {
  API_BASE_URL,
  PRODUCT_ATTRIBUTE_VALUES,
  PRODUCT_ATTRIBUTES,
} from '../../utils/apiActions';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import FilterList from './FilterList';
import {useAppTheme} from '../../utils/theme';
import FilterIcon from '../../assets/filter.svg';

interface Filters {
  providerId: any;
  category: any;
  selectedAttributes: any;
  setSelectedAttributes: (values: any) => void;
}

const screenHeight = Dimensions.get('screen').height;

const CancelToken = axios.CancelToken;
const Filters: React.FC<Filters> = React.memo(
  ({
    providerId = null,
    category = null,
    selectedAttributes,
    setSelectedAttributes,
  }) => {
    const {t} = useTranslation();
    const attributeSource = useRef<any>(null);
    const [attributes, setAttributes] = useState<any[]>([]);
    const [attributesRequested, setAttributesRequested] =
      useState<boolean>(true);
    const {getDataWithWithoutEncode} = useNetworkHandling();
    const {handleApiError} = useNetworkErrorHandling();
    const theme = useAppTheme();
    const refFilterSheet = useRef<any>(null);
    const styles = makeStyles(theme.colors);

    const getAttributes = async () => {
      try {
        setAttributesRequested(true);
        setAttributes([]);
        attributeSource.current = CancelToken.source();
        let url = `${API_BASE_URL}${PRODUCT_ATTRIBUTES}${
          providerId ? `?provider=${encodeURIComponent(providerId)}` : ''
        }${category ? `?category=${encodeURIComponent(category)}` : ''}`;
        const {data} = await getDataWithWithoutEncode(
          url,
          attributeSource.current.token,
        );
        setAttributes(data.response.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setAttributesRequested(false);
      }
    };

    const getAttributeValues = async (attribute: string) => {
      try {
        attributeSource.current = CancelToken.source();
        let url = `${API_BASE_URL}${PRODUCT_ATTRIBUTE_VALUES}?attribute_code=${encodeURIComponent(
          attribute,
        )}${providerId ? `&provider=${encodeURIComponent(providerId)}` : ''}${
          category ? `&category=${encodeURIComponent(category)}` : ''
        }`;
        const {data} = await getDataWithWithoutEncode(
          url,
          attributeSource.current.token,
        );
        const list = attributes.concat([]);
        const selectedAttribute: any = list.find(
          (one: any) => one.code === attribute,
        );
        if (selectedAttribute) {
          selectedAttribute.values = data.response.data;
        }
        setAttributes(list);
      } catch (error) {
        handleApiError(error);
      }
    };

    const openSheet = useCallback(
      () => refFilterSheet.current.open(),
      [refFilterSheet],
    );

    const closeSheet = useCallback(
      () => refFilterSheet.current.close(),
      [refFilterSheet],
    );

    useEffect(() => {
      getAttributes().then(() => {});

      return () => {
        if (attributeSource.current) {
          attributeSource.current.cancel();
        }
      };
    }, [category, providerId]);

    if (attributes?.length > 0) {
      const attributesHeight = attributes.length * 40 + 200;
      return (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              attributesRequested
                ? styles.disabledFilterButton
                : styles.activeFilterButton,
            ]}
            onPress={openSheet}>
            <FilterIcon width={13} height={13} />
            <Text
              variant={'labelLarge'}
              style={
                attributesRequested
                  ? styles.disabledFilterLabel
                  : styles.filterLabel
              }>
              {t('Product SubCategories.Filter')}
            </Text>
          </TouchableOpacity>
          <RBSheet
            ref={refFilterSheet}
            height={
              attributesHeight > screenHeight
                ? screenHeight - 100
                : attributesHeight
            }
            customStyles={{
              container: styles.rbSheet,
            }}>
            <FilterList
              selectedAttributes={selectedAttributes}
              setSelectedAttributes={setSelectedAttributes}
              attributes={attributes}
              getAttributeValues={getAttributeValues}
              close={closeSheet}
            />
          </RBSheet>
        </View>
      );
    } else {
      return <View />;
    }
  },
);

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterLabel: {
      color: colors.primary,
    },
    filterButton: {
      borderRadius: 8,
      borderWidth: 1,
      width: 68,
      height: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    disabledFilterButton: {
      borderColor: colors.neutral100,
    },
    activeFilterButton: {
      borderColor: colors.primary,
    },
    disabledFilterLabel: {
      color: colors.neutral100,
    },
    rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 24,
    },
  });

export default Filters;
