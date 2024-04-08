import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import {API_BASE_URL, PROVIDER, STORE_DETAILS} from '../../../utils/apiActions';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import BrandSkeleton from '../../../components/skeleton/BrandSkeleton';
import FBBrandDetails from './components/FBBrandDetails';
import OtherBrandDetails from './components/OtherBrandDetails';
import {FB_DOMAIN} from '../../../utils/constants';
import Page from '../../../components/page/Page';
import {useAppTheme} from '../../../utils/theme';

const CancelToken = axios.CancelToken;

const BrandDetails = ({route: {params}}: {route: any}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const source = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [provider, setProvider] = useState<any>(null);
  const [outlet, setOutlet] = useState<any>(null);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const [outletDetailsRequested, setOutletDetailsRequested] =
    useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getOutletDetails = async () => {
    try {
      setOutletDetailsRequested(true);
      source.current = CancelToken.source();
      const locationResponse = await getDataWithAuth(
        `${API_BASE_URL}${STORE_DETAILS}?id=${params.outletId}`,
        source.current.token,
      );
      const data = locationResponse?.data?.response;
      if (data) {
        data.timings = '';
        data.isOpen = false;
        if (data.time.range.start && data.time.range.end) {
          data.timings = `${moment(data.time.range.start, 'hhmm').format(
            'h:mm a',
          )} - ${moment(data.time.range.end, 'hhmm').format('h:mm a')}`;
          const time = moment();
          const startTime = moment(data.time.range.start, 'hh:mm');
          const endTime = moment(data.time.range.end, 'hh:mm');
          data.isOpen = time.isBetween(startTime, endTime);
        }
        setOutlet(data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setOutletDetailsRequested(false);
    }
  };

  const getProviderDetails = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const providerResponse = await getDataWithAuth(
        `${API_BASE_URL}${PROVIDER}?id=${params.brandId}`,
        source.current.token,
      );
      const data = providerResponse?.data?.response;
      navigation.setOptions({
        headerTitle: data?.descriptor?.name,
      });
      await getOutletDetails();
      setProvider(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  useEffect(() => {
    getProviderDetails().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [isFocused]);

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <Page>
      <View style={styles.container}>
        {provider?.domain === FB_DOMAIN ? (
          <FBBrandDetails
            provider={provider}
            outlet={outlet}
            apiRequested={apiRequested || outletDetailsRequested}
          />
        ) : (
          <OtherBrandDetails
            provider={provider}
            outlet={outlet}
            apiRequested={apiRequested || outletDetailsRequested}
          />
        )}
      </View>
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
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
