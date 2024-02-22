import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, View} from 'react-native';
import {API_BASE_URL, CUSTOM_MENU} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {skeletonList} from '../../../../utils/utils';
import CustomMenuSkeleton from '../../../../components/skeleton/CustomMenuSkeleton';
import CustomMenuItem from './CustomMenuItem';
import {useAppTheme} from '../../../../utils/theme';

interface CustomMenu {
  providerId: string;
  providerDomain: string;
  setSelectedMenu: (menu: any) => void;
  selectedMenu: any;
}

const CancelToken = axios.CancelToken;

const CustomMenu: React.FC<CustomMenu> = ({
  providerId,
  providerDomain,
  selectedMenu,
  setSelectedMenu,
}) => {
  const customMenuSource = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${providerId}&domain=${providerDomain}`,
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

  return menuRequested ? (
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
        renderItem={({item}) => (
          <CustomMenuItem
            item={item}
            selected={item.id === selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    menuContainer: {
      paddingVertical: 16,
      paddingLeft: 16,
    },
  });

export default CustomMenu;
