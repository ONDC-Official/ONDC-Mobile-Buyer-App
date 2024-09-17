import React, {useCallback} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';

import {useAppTheme} from '../../../utils/theme';
import {setStoredData} from '../../../utils/storage';
import {updateLanguage} from '../../../toolkit/reducer/auth';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import Header from '../../../components/header/HeaderWithActions';

interface Menu {
  title: string;
  code: string;
  onPress: () => void;
}

const ItemSeparatorComponent = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return <View style={styles.divider} />;
};

const ChooseLanguage = () => {
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const {language} = useSelector(({auth}) => auth);

  const handleChangeLanguage = async (selectedLanguage: string) => {
    await i18n.changeLanguage(selectedLanguage);
    await setStoredData('language', selectedLanguage);
    dispatch(updateLanguage(selectedLanguage));
    // Check if address preselected, if so directly navigate
    // to dashboard
    if (address && address.address) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'AddressList', params: {navigateToDashboard: true}}],
      });
    }
  };

  const menu: Menu[] = [
    {
      title: t('Choose Language.Hindi'),
      code: 'hi',
      onPress: () => {
        handleChangeLanguage('hi').then(() => {});
      },
    },
    {
      title: t('Choose Language.English'),
      code: 'en',
      onPress: () => {
        handleChangeLanguage('en').then(() => {});
      },
    },
    {
      title: t('Choose Language.Marathi'),
      code: 'mr',
      onPress: () => {
        handleChangeLanguage('mr').then(() => {});
      },
    },
    {
      title: t('Choose Language.Tamil'),
      code: 'ta',
      onPress: () => {
        handleChangeLanguage('ta').then(() => {});
      },
    },
    {
      title: t('Choose Language.Bengali'),
      code: 'bn',
      onPress: () => {
        handleChangeLanguage('bn').then(() => {});
      },
    },
  ];

  const renderItem = useCallback(
    ({item}: {item: Menu}) => {
      const {title, code, onPress} = item;
      const selectedLanguage = code === language;
      return (
        <TouchableOpacity style={styles.menuOption} onPress={onPress}>
          {selectedLanguage ? (
            <Text
              variant={'titleLarge'}
              style={[styles.menuName, styles.selected]}>
              {title}
            </Text>
          ) : (
            <Text variant={'titleMedium'} style={styles.menuName}>
              {title}
            </Text>
          )}
          <Icon
            name={'keyboard-arrow-right'}
            size={24}
            color={theme.colors.neutral400}
          />
        </TouchableOpacity>
      );
    },
    [theme, language, styles],
  );

  return (
    <SafeAreaPage>
      <Header label={t('Choose Language.Choose Language')} />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.title}
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={menu}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaPage>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    inputLabel: {
      color: colors.neutral400,
      padding: 12,
      paddingTop: 20,
    },
    listContainer: {
      paddingHorizontal: 16,
    },
    menuOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
    },
    menuName: {
      color: colors.neutral400,
    },
    selected: {
      color: colors.primary,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
  });

export default ChooseLanguage;
