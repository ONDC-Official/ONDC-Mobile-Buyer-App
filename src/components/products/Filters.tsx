import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
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
const Filters: React.FC<Filters> = ({
  providerId = null,
  category = null,
  selectedAttributes,
  setSelectedAttributes,
}) => {
  const attributeSource = useRef<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributesRequested, setAttributesRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const theme = useAppTheme();
  const refFilterSheet = useRef<any>(null);
  const styles = makeStyles(theme.colors);

  const getAttributes = async () => {
    try {
      setAttributesRequested(true);
      attributeSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${PRODUCT_ATTRIBUTES}`;
      url += providerId ? `?provider=${providerId}` : '';
      url += category ? `?category=${category}` : '';
      const {data} = await getDataWithAuth(url, attributeSource.current.token);
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
      let url = `${API_BASE_URL}${PRODUCT_ATTRIBUTE_VALUES}?attribute_code=${attribute}`;
      url += providerId ? `&provider=${providerId}` : '';
      url += category ? `&category=${category}` : '';
      const {data} = await getDataWithAuth(url, attributeSource.current.token);
      const list = Object.assign([], attributes);
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

  useEffect(() => {
    getAttributes().then(() => {});

    return () => {
      if (attributeSource.current) {
        attributeSource.current.cancel();
      }
    };
  }, []);

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
          onPress={() => refFilterSheet.current.open()}>
          <Text
            variant={'labelMedium'}
            style={
              attributesRequested
                ? styles.disabledFilterLabel
                : styles.filterLabel
            }>
            Filter
          </Text>
          <FilterIcon width={18} height={18} />
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
            close={() => refFilterSheet.current.close()}
          />
        </RBSheet>
      </View>
    );
  } else {
    return <View />;
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterLabel: {
      marginRight: 8,
      color: colors.primary,
    },
    filterButton: {
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
    },
    disabledFilterButton: {
      borderColor: colors.neutral100,
    },
    activeFilterButton: {
      borderColor: colors.primary,
    },
    disabledFilterLabel: {
      color: colors.neutral100,
      marginRight: 8,
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
