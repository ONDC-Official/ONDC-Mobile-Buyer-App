import React, {useCallback} from 'react';
import {Text} from 'react-native-paper';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import useLogoutUser from '../../../../../hooks/useLogoutUser';
import {alertWithTwoButtons} from '../../../../../utils/alerts';
import {useAppTheme} from '../../../../../utils/theme';
import useStatusBarColor from '../../../../../hooks/useStatusBarColor';

const ItemSeparatorComponent = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return <View style={styles.divider} />;
};

const Profile = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {clearDataAndLogout} = useLogoutUser();
  const navigation = useNavigation<StackNavigationProp<any>>();
  useStatusBarColor('dark-content', theme.colors.white);

  const confirmLogout = useCallback(() => {
    alertWithTwoButtons(
      t('Profile.Logout'),
      t('Profile.Are you sure you want to logout?'),
      t('Profile.Cancel'),
      () => {},
      t('Profile.Logout'),
      () => clearDataAndLogout(),
    );
  }, [clearDataAndLogout, t]);

  const navigateToProfile = useCallback(
    () => navigation.navigate('MyProfile'),
    [navigation],
  );

  const navigateToComplaints = useCallback(
    () => navigation.navigate('Complaints'),
    [navigation],
  );

  const navigateToChooseLanguage = useCallback(
    () => navigation.navigate('ChooseLanguage'),
    [navigation],
  );

  const menu = [
    {
      title: t('Profile.My Profile'),
      action: navigateToProfile,
    },
    {
      title: t('Profile.Complaints'),
      action: navigateToComplaints,
    },
    {
      title: t('Profile.Language'),
      action: navigateToChooseLanguage,
    },
    {
      title: t('Profile.Logout'),
      action: confirmLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {t('Profile.Profile')}
        </Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.title}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={menu}
        renderItem={({item: {title, action}}) => (
          <TouchableOpacity style={styles.menuOption} onPress={action}>
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
    header: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    pageTitle: {
      color: colors.neutral400,
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

export default Profile;
