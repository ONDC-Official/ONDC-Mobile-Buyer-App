import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useEffect, useRef, useState} from 'react';
import Store from './components/Store';
import {useAppTheme} from '../../../utils/theme';
import Page from '../../../components/page/Page';
import axios from 'axios';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import {API_BASE_URL, LOCATIONS} from '../../../utils/apiActions';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import getDistance from 'geolib/es/getDistance';
import useLocationBackgroundFetch from '../../../hooks/useLocationBackgroundFetch';

interface StoresNearMe {
  domain?: string;
}

const CancelToken = axios.CancelToken;

const StoresNearMe: React.FC<StoresNearMe> = ({domain}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  // const {locations} = useSelector(({stores}) => stores);
  const {address} = useSelector(({address}) => address);
  const source = useRef<any>(null);
  const totalLocations = useRef<number>(0);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [providerId, setProviderId] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const {getCurrentLocation} = useLocationBackgroundFetch();

  useEffect(() => {
    navigation.setOptions({
      title: t('Stores Near me.Stores Near me'),
    });
    getAllLocations();
  }, []);

  const loadMoreList = () => {
    if (totalLocations.current > locations?.length && !moreListRequested) {
      setMoreListRequested(true);
      getAllLocations()
        .then(() => {
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
        });
    }
  };

  const getAllLocations = async () => {
    try {
      // setApiRequested(true);
      source.current = CancelToken.source();

      const url = `${API_BASE_URL}${LOCATIONS}?afterKey=${providerId}&limit=${20}&latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&radius=100${
        domain ? `&domain=${domain}` : ''
      }`;
      const {data} = await getDataWithAuth(url, source.current.token);
      totalLocations.current = data.count;
      setProviderId(data?.afterKey?.location_id);

      getCurrentLocation()
        .then(location => {
          if (location) {
            const disData = data.data.map((item: any) => {
              const distance =
                (
                  getDistance(
                    {
                      latitude: location.longitude,
                      longitude: location.latitude,
                    },
                    {
                      latitude: item.gps.split(/\s*,\s*/)[0],
                      longitude: item.gps.split(/\s*,\s*/)[1],
                    },
                  ) / 1000
                ).toFixed(2) + ' km';
              return {...item, ...{distance: distance}};
            });
            setLocations([...locations, ...disData]);
          }
        })
        .catch(error => {});
    } catch (error) {
      handleApiError(error);
    } finally {
      // setApiRequested(false);
    }
  };

  const renderItem = ({item}: {item: any}) => <Store store={item} />;

  return (
    <Page>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={locations}
          renderItem={renderItem}
          numColumns={3}
          onEndReached={loadMoreList}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      flex: 1,
    },
  });

export default StoresNearMe;
