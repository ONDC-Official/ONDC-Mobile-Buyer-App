import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {API_BASE_URL, CUSTOM_MENU} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {skeletonList} from '../../../../utils/utils';
import CustomMenuSkeleton from '../../../../components/skeleton/CustomMenuSkeleton';
import CustomMenu from './CustomMenu';
import Filters from './Filters';

interface OtherBrandDetails {
  provider: any;
}

const CancelToken = axios.CancelToken;

const OtherBrandDetails: React.FC<OtherBrandDetails> = ({provider}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const customMenuSource = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider.id}&domain=${provider.domain}`,
        customMenuSource.current.token,
      );
      setMenu(data.data);
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

  return (
    <View style={styles.container}>
      {menuRequested ? (
        <View style={styles.menuContainer}>
          <FlatList
            horizontal
            data={skeletonList}
            renderItem={() => <CustomMenuSkeleton />}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={styles.menuContainer}>
          <FlatList
            horizontal
            data={menu}
            keyExtractor={item => item.id}
            renderItem={({item}) => <CustomMenu item={item} selected={false} />}
          />
        </View>
      )}
      <View style={styles.filterContainer}>
        <Filters providerId={provider.id} />
        <View style={styles.reorderContainer}>
          <TouchableOpacity
            onPress={() => setIsGridView(true)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.activeReorderButton
                : styles.defaultReorderButton,
            ]}>
            <Icon name={'reorder-vertical'} size={20} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            onPress={() => setIsGridView(false)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.defaultReorderButton
                : styles.activeReorderButton,
            ]}>
            <Icon name={'reorder-horizontal'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    menuContainer: {
      paddingVertical: 16,
      paddingLeft: 16,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      marginTop: 8,
    },
    reorderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      width: 9,
    },
    reorderButton: {
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
    },
    activeReorderButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    defaultReorderButton: {
      borderColor: '#E8E8E8',
    },
  });

export default OtherBrandDetails;
