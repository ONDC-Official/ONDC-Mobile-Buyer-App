import React, {useEffect} from 'react';
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

const ChooseLanguage = () => {
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const {address} = useSelector((state: any) => state.address);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const styles = makeStyles(theme.colors);

  const handleChangeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await setStoredData('language', language);
    dispatch(updateLanguage(language));
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

  const menu = [
    {
      title: t('Choose Language.Hindi'),
      onPress: () => {
        handleChangeLanguage('hi').then(() => {});
      },
    },
    {
      title: t('Choose Language.English'),
      onPress: () => {
        handleChangeLanguage('en').then(() => {});
      },
    },
    {
      title: t('Choose Language.Marathi'),
      onPress: () => {
        handleChangeLanguage('mr').then(() => {});
      },
    },
    {
      title: t('Choose Language.Tamil'),
      onPress: () => {
        handleChangeLanguage('ta').then(() => {});
      },
    },
    {
      title: t('Choose Language.Bengali'),
      onPress: () => {
        handleChangeLanguage('bn').then(() => {});
      },
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: t('Choose Language.Choose Language'),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text variant={'bodyMedium'} style={styles.inputLabel}>
        {t('Choose Language.Select a language')}
      </Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.title}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        data={menu}
        renderItem={({item: {title, onPress}}) => (
          <TouchableOpacity style={styles.menuOption} onPress={onPress}>
            <Text variant={'titleMedium'} style={styles.menuName}>
              {title}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
        )}
      />
    </View>
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
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
  });

export default ChooseLanguage;
