import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {API_BASE_URL, PROVIDER} from '../../../utils/apiActions';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import BrandSkeleton from '../../../components/skeleton/BrandSkeleton';
import FBBrandDetails from './components/FBBrandDetails';
import OtherBrandDetails from './components/OtherBrandDetails';

interface BrandDetails {
  route: any;
  theme: any;
}

const CancelToken = axios.CancelToken;

const BrandDetails: React.FC<BrandDetails> = ({route: {params}}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const source = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [provider, setProvider] = useState<any>(null);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getProviderDetails = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PROVIDER}?id=${params.brandId}`,
        source.current.token,
      );
      setProvider(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.name,
    });
  }, [navigation]);

  useEffect(() => {
    getProviderDetails().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, []);

  if (apiRequested) {
    return <BrandSkeleton />;
  }
  return (
    <View style={styles.container}>
      {params.domain === 'ONDC:RET11' ? (
        <FBBrandDetails provider={provider} apiRequested={apiRequested} />
      ) : (
        <OtherBrandDetails provider={provider} />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    brandImage: {
      height: 268,
    },
    brandDetails: {
      padding: 16,
    },
    borderBottom: {
      backgroundColor: '#E0E0E0',
      height: 1,
      marginVertical: 24,
    },
  });

export default BrandDetails;
