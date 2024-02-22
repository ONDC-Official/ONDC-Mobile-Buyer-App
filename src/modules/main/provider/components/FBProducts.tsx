import React, {useEffect, useRef, useState} from 'react';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {API_BASE_URL, CUSTOM_MENU, ITEMS} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import CustomMenuAccordion from './CustomMenuAccordion';
import {useAppTheme} from '../../../../utils/theme';

const CancelToken = axios.CancelToken;
const FBProducts = ({provider, domain}: {provider: string; domain: string}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const customMenuSource = useRef<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider}&domain=${domain}`,
        customMenuSource.current.token,
      );
      const menuResponses = await Promise.all(
        data.data.map((one: any) =>
          getDataWithAuth(
            `${API_BASE_URL}${ITEMS}?customMenu=${one.id}`,
            customMenuSource.current.token,
          ),
        ),
      );
      setMenu(
        data.data.map((one: any, index: number) => {
          one.items = menuResponses[index].data.data;
          return one;
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setMenuRequested(false);
    }
  };

  useEffect(() => {
    getCustomMenu().then(() => {});

    return () => {
      if (customMenuSource.current) {
        customMenuSource.current.cancel();
      }
    };
  }, []);

  if (menuRequested) {
    return (
      <>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </>
    );
  }

  return (
    <View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'veg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'veg'
              ? setSelectedFilter('')
              : setSelectedFilter('veg')
          }>
          <FastImage
            source={require('../../../../assets/veg.png')}
            style={styles.filterIcon}
          />
          <Text
            variant={'bodyMedium'}
            style={[
              styles.filterLabel,
              selectedFilter === 'veg' ? styles.selectedFilterLabel : {},
            ]}>
            Veg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'nonveg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'nonveg'
              ? setSelectedFilter('')
              : setSelectedFilter('nonveg')
          }>
          <FastImage
            source={require('../../../../assets/non_veg.png')}
            style={styles.filterIcon}
          />
          <Text
            variant={'bodyMedium'}
            style={[
              styles.filterLabel,
              selectedFilter === 'nonveg' ? styles.selectedFilterLabel : {},
            ]}>
            Non-veg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            selectedFilter === 'egg' ? styles.selectedFilter : {},
          ]}
          onPress={() =>
            selectedFilter === 'egg'
              ? setSelectedFilter('')
              : setSelectedFilter('egg')
          }>
          <FastImage
            source={require('../../../../assets/non_veg.png')}
            style={styles.filterIcon}
          />
          <Text
            variant={'bodyMedium'}
            style={[
              styles.filterLabel,
              selectedFilter === 'egg' ? styles.selectedFilterLabel : {},
            ]}>
            Egg
          </Text>
        </TouchableOpacity>
      </View>
      {menu.map(section => (
        <CustomMenuAccordion
          key={section.id}
          section={section}
          selectedFilter={selectedFilter}
        />
      ))}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
    },
    filter: {
      borderRadius: 60,
      backgroundColor: '#F1F2F2',
      borderWidth: 1,
      borderColor: '#F1F2F2',
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    selectedFilter: {
      backgroundColor: '#E3F3F9',
      borderColor: '#5DB7DE',
    },
    filterIcon: {
      width: 18,
      height: 18,
    },
    filterLabel: {
      color: '#222222',
      marginLeft: 4,
    },
    selectedFilterLabel: {
      color: '#196AAB',
    },
  });

export default FBProducts;
