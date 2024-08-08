import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {API_BASE_URL, PROVIDER, STORE_DETAILS} from '../../../utils/apiActions';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import BrandSkeleton from '../../../components/skeleton/BrandSkeleton';
import FBBrandDetails from './components/FBBrandDetails';
import OtherBrandDetails from './components/OtherBrandDetails';
import {FB_DOMAIN} from '../../../utils/constants';
import Page from '../../../components/page/Page';
import {useAppTheme} from '../../../utils/theme';
import useFormatDate from '../../../hooks/useFormatDate';

const CancelToken = axios.CancelToken;

const getStartAndEndTime = (item: any) => {
  let startTime: string = '',
    endTime: string = '';
  item?.list?.forEach((element: any) => {
    if (element.code === 'time_from') {
      startTime = element?.value;
    }
    if (element.code === 'time_to') {
      endTime = element?.value;
    }
  });

  return {startTime, endTime};
};

const getMomentDateFromHourMinutes = (timeString: string) => {
  // Extract hours and minutes from the string
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(2, 4), 10);

  // Create a moment object with the current date
  const currentDate = moment();

  // Set the extracted hours and minutes
  currentDate.set({hour: hours, minute: minutes});

  return currentDate;
};

const BrandDetails = ({route: {params}}: {route: any}) => {
  const {address} = useSelector((state: any) => state.address);
  const isFocused = useIsFocused();
  const {formatDate} = useFormatDate();
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
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${STORE_DETAILS}?id=${params.outletId}&pincode=${address.address.areaCode}`,
        source.current.token,
      );
      if (data) {
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
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PROVIDER}?id=${params.brandId}`,
        source.current.token,
      );

      let time_from: string = '';
      let time_to: string = '';

      let timings = data?.tags?.filter((item: any) => {
        const isTiming = item.code === 'timing';
        if (isTiming) {
          const locationIndex = item.list.findIndex(
            (one: any) =>
              one.code === 'location' && one.value === data.local_id,
          );
          if (locationIndex > -1) {
            return true;
          }
        } else {
          return false;
        }
      });

      if (timings.length === 1) {
        timings[0]?.list.forEach((element: any) => {
          if (element.code === 'time_from') {
            time_from = element?.value;
          }
          if (element.code === 'time_to') {
            time_to = element?.value;
          }
        });
      } else {
        const allTime = timings.find((time: any) => {
          return !!time.list.find(
            (item: any) => item.code === 'type' && item.value === 'ALL',
          );
        });
        if (allTime) {
          const time = getStartAndEndTime(allTime);
          time_from = time.startTime;
          time_to = time.endTime;
        } else {
          const orderTime = timings.find((time: any) => {
            return !!time.list.find(
              (item: any) => item.code === 'type' && item.value === 'Order',
            );
          });
          if (orderTime) {
            const time = getStartAndEndTime(orderTime);
            time_from = time.startTime;
            time_to = time.endTime;
          } else {
            const deliveryTime = timings.find((time: any) => {
              return !!time.list.find(
                (item: any) =>
                  item.code === 'type' && item.value === 'Delivery',
              );
            });
            if (deliveryTime) {
              const time = getStartAndEndTime(deliveryTime);
              time_from = time.startTime;
              time_to = time.endTime;
            } else {
              const selfPickupTime = timings.find((time: any) => {
                return !!time.list.find(
                  (item: any) =>
                    item.code === 'type' && item.value === 'Self-Pickup',
                );
              });
              if (selfPickupTime) {
                const time = getStartAndEndTime(selfPickupTime);
                time_from = time.startTime;
                time_to = time.endTime;
              }
            }
          }
        }
      }

      const time = moment();
      const startTime = getMomentDateFromHourMinutes(time_from);
      const endTime = getMomentDateFromHourMinutes(time_to);
      const isOpen = time.isBetween(startTime, endTime);

      navigation.setOptions({
        headerTitle: data?.descriptor?.name,
      });
      await getOutletDetails();
      setProvider({
        ...data,
        ...{
          isOpen,
          time_from: formatDate(startTime, 'hh:mm a'),
        },
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getProviderDetails().then(() => {});
    }

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
    <Page outletId={params.outletId}>
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
