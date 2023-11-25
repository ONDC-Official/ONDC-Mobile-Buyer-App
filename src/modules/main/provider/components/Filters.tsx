import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL, PRODUCT_ATTRIBUTES} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';

interface Filters {
  providerId: string;
}

const CancelToken = axios.CancelToken;
const Filters: React.FC<Filters> = ({providerId}) => {
  const attributeSource = useRef<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributesRequested, setAttributesRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const getAttributes = async () => {
    try {
      setAttributesRequested(true);
      attributeSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PRODUCT_ATTRIBUTES}?provider=${providerId}`,
        attributeSource.current.token,
      );
      console.log(JSON.stringify(data, undefined, 4));
      setAttributes(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setAttributesRequested(false);
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

  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        attributesRequested
          ? styles.disabledFilterButton
          : styles.activeFilterButton,
      ]}>
      <Text
        variant={'labelMedium'}
        style={
          attributesRequested ? styles.disabledFilterLabel : styles.filterLabel
        }>
        Filter
      </Text>
      <Icon
        name={'filter-variant'}
        color={attributesRequested ? '#E8E8E8' : theme.colors.primary}
      />
    </TouchableOpacity>
  );
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
      borderColor: '#E8E8E8',
    },
    activeFilterButton: {
      borderColor: colors.primary,
    },
    disabledFilterLabel: {
      color: '#E8E8E8',
      marginRight: 8,
    },
  });

export default Filters;
