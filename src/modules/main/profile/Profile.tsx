import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Button, Chip, Modal, Portal, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useAppTheme} from '../../../utils/theme';

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
  const {name, emailId} = useSelector(({auth}) => auth);
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const verifyEmail = async () => {
    await auth().currentUser?.sendEmailVerification();
  };

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    navigation.setOptions({
      title: t('Profile.My Profile'),
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text variant={'bodySmall'} style={styles.label}>
            {t('Profile.Name')}
          </Text>
          <Text variant={'titleMedium'} style={styles.value}>
            {name}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.emailContainer}>
          <View>
            <Text variant={'bodySmall'} style={styles.label}>
              {t('Profile.Email')}
            </Text>
            <Text variant={'titleMedium'} style={styles.value}>
              {emailId}
            </Text>
          </View>
          <View style={styles.chipContainer}>
            {auth().currentUser?.emailVerified ? (
              <Chip
                mode={'flat'}
                icon={'check-circle'}
                style={styles.chip}
                textStyle={styles.chipText}>
                {t('Profile.Verified')}
              </Chip>
            ) : (
              <Button mode={'text'} onPress={verifyEmail}>
                {t('Profile.Verify')}
              </Button>
            )}
          </View>
        </View>
      </View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={closeModal}>
              <MaterialIcons name={'clear'} size={16} />
            </TouchableOpacity>
          </View>
          <View>
            <MaterialIcons name={'email'} size={100} color={colors.primary} />
            <Text variant={'headlineMedium'} style={styles.modalTitle}>
              {t('Profile.Verify Email')}
            </Text>
          </View>
          <Text variant={'bodySmall'}>{t('Profile.Email send')}</Text>
        </Modal>
      </Portal>
    </>
  );
};

export default Profile;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.white,
      flex: 1,
    },
    divider: {
      marginVertical: 12,
      height: 1,
      width: '100%',
      backgroundColor: colors.neutral100,
    },
    label: {
      marginBottom: 4,
    },
    value: {
      paddingVertical: 12,
    },
    emailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    chip: {backgroundColor: colors.primary50},
    chipText: {color: colors.primary},
    chipContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer: {
      backgroundColor: colors.white,
      padding: 16,
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
  });
