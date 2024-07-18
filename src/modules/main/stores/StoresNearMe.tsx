import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Store from './components/Store';
import {useAppTheme} from '../../../utils/theme';
import Page from '../../../components/page/Page';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import {API_BASE_URL, LOCATIONS} from '../../../utils/apiActions';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import useCalculateTimeToShip from '../../../hooks/useCalculateTimeToShip';

interface StoresNearMe {
  domain?: string;
}

const CancelToken = axios.CancelToken;

const StoresNearMe: React.FC<StoresNearMe> = ({route}: any) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {calculateTimeToShip} = useCalculateTimeToShip();
  const {address} = useSelector((state: any) => state?.address);
  const source = useRef<any>(null);
  const totalLocations = useRef<number>(0);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [providerId, setProviderId] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: t('Stores Near me.Stores Near me'),
    });
    getAllLocations().then(() => {});
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
      source.current = CancelToken.source();

      const url = `${API_BASE_URL}${LOCATIONS}?afterKey=${providerId}&limit=${20}&latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&radius=100${
        route?.params?.domain ? `&domain=${route?.params?.domain}` : ''
      }`;
      const {data} = await getDataWithAuth(url, source.current.token);
      totalLocations.current = data.count;
      setProviderId(data?.afterKey?.location_id);

      const distanceData = calculateTimeToShip(data.data, {
        latitude: address.address.lat,
        longitude: address.address.lng,
      });
      const list = [...locations, ...distanceData];
      setLocations(list.sort((a: any, b: any) => a.timeToShip - b.timeToShip));
    } catch (error) {
      handleApiError(error);
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
