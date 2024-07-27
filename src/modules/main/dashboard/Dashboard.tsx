import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Modal, Portal, Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import List from './components/tabs/List';
import Profile from './components/tabs/Profile';
import DashboardCart from './components/tabs/Cart';
import useCartItems from '../../../hooks/useCartItems';
import useRefreshToken from '../../../hooks/useRefreshToken';
import {useAppTheme} from '../../../utils/theme';
import AvailableCities from '../../../assets/available_cities.svg';
import { getStoredData, setStoredData } from "../../../utils/storage";

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const {getCartItems} = useCartItems();
  const {t} = useTranslation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {} = useRefreshToken();
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    getCartItems().then(() => {});
    getStoredData('cityPopupShown').then(cityPopupShown => {
      if (!cityPopupShown) {
        setModalVisible(true);
        setStoredData('cityPopupShown', 'true').then(() => {});
      }
    });
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="List" component={List} />
        <Tab.Screen name="Cart" component={DashboardCart} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={closeModal}>
              <MaterialIcons name={'clear'} size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <AvailableCities width={80} height={80} />
            <Text variant={'headlineMedium'} style={styles.modalTitle}>
              {t('Global.Available Cities')}
            </Text>
            <Text variant={'bodySmall'}>
              {t('Global.The app is only for Delhi city')}
            </Text>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
      borderRadius: 20,
      margin: 20,
      alignItems: 'center',
    },
    modalTitle: {
      marginTop: 20,
      marginBottom: 6,
    },
    closeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      width: '100%',
      marginBottom: 20,
    },
    modalContent: {
      alignItems: 'center',
      textAlign: 'center',
    },
  });
export default Dashboard;
