import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {memo, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Store from './components/Store';
import {useAppTheme} from '../../../utils/theme';
import ProductSkeleton from '../../../components/skeleton/ProductSkeleton';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import {API_BASE_URL, SERVICEABLE_LOCATIONS} from '../../../utils/apiActions';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import useCalculateTimeToShip from '../../../hooks/useCalculateTimeToShip';
import Header from '../../../components/header/HeaderWithActions';

interface StoresNearMe {
  domain?: string;
}

const CancelToken = axios.CancelToken;

const MemoizedStore = memo(Store, (prevProps, nextProps) => {
  return prevProps.store.id === nextProps.store.id; // Custom comparison to avoid unnecessary renders
});

const ListFooterComponent = ({
  moreListRequested,
}: {
  moreListRequested: boolean;
}) => (moreListRequested ? <ProductSkeleton /> : <></>);

const renderItem = ({item}: {item: any}) => <MemoizedStore store={item} />;

const StoresNearMe: React.FC<StoresNearMe> = ({route}: any) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {calculateTimeToShip} = useCalculateTimeToShip();
  const {address} = useSelector((state: any) => state?.address);
  const source = useRef<any>(null);
  const totalLocations = useRef<number>(0);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [locations, setLocations] = useState<any[]>([]);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    getAllLocations(0).then(() => {});
  }, []);

  const loadMoreList = () => {
    if (totalLocations.current > locations?.length && !moreListRequested) {
      getAllLocations(page)
        .then(() => {})
        .catch(() => {});
    }
  };

  const getAllLocations = async (pageNumber: number) => {
    setMoreListRequested(true);
    try {
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${SERVICEABLE_LOCATIONS}?page=${pageNumber}&limit=${21}&latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&pincode=${
        address.address.areaCode
      }&radius=100${
        route?.params?.domain ? `&domain=${route?.params?.domain}` : ''
      }`;
      const {data} = await getDataWithAuth(url, source.current.token);
      const distanceData = calculateTimeToShip(data.data, {
        latitude: address.address.lat,
        longitude: address.address.lng,
      });
      setPage(pageNumber + 1);
      const list =
        pageNumber === 0 ? distanceData : [...locations, ...distanceData];
      setLocations(list);
      totalLocations.current = data.data.length > 0 ? data.count : list.length;
    } catch (error) {
      handleApiError(error);
    } finally {
      setMoreListRequested(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header label={t('Stores Near me.Stores Near me')} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={locations}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.subContainer}
        initialNumToRender={21}
        maxToRenderPerBatch={24}
        onEndReached={loadMoreList}
        ListFooterComponent={
          <ListFooterComponent moreListRequested={moreListRequested} />
        }
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
    },
    subContainer: {paddingHorizontal: 11},
  });

export default StoresNearMe;
