import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Avatar, Text} from 'react-native-paper';

import {getUserInitials} from '../../../utils/utils';
import {useAppTheme} from '../../../utils/theme';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

/**
 * Component to render profile screen which shows user profile
 * @constructor
 * @returns {JSX.Element}
 */
const Profile = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {name, emailId, photoURL} = useSelector(({authReducer}) => authReducer);

  useEffect(() => {
    navigation.setOptions({
      title: t('Profile.My Profile'),
    });
  }, []);

  return (
    <View style={styles.container}>
      {photoURL ? (
        <Avatar.Image size={72} source={{uri: photoURL}} />
      ) : (
        <Avatar.Text size={72} label={getUserInitials(name ?? '')} />
      )}
      <View style={styles.profileDetailsContainer}>
        <Text variant={'titleMedium'} style={styles.name}>
          {name}
        </Text>
        <Text variant={'bodyLarge'}>{emailId}</Text>
      </View>
    </View>
  );
};

export default Profile;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.white,
    },
    name: {marginVertical: 8},
    profileDetailsContainer: {
      marginLeft: 8,
    },
  });
