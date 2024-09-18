import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../utils/theme';

interface ListingTab {
  isStore: boolean;
  setSearchType: (values: any) => void;
}

const CategoryTab: React.FC<ListingTab> = ({isStore, setSearchType}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.switchRow}>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setSearchType('Stores')}
          style={[styles.button, isStore ? styles.activeButton : {}]}>
          <Text
            variant={'bodyMedium'}
            style={isStore ? styles.activeButtonText : styles.buttonText}>
            {t('Search.Stores')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSearchType('Products')}
          style={[styles.button, !isStore ? styles.activeButton : {}]}>
          <Text
            variant={'bodyMedium'}
            style={!isStore ? styles.activeButtonText : styles.buttonText}>
            {t('Search.Products')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    switchRow: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    switchContainer: {
      height: 28,
      width: 168,
      borderRadius: 24,
      backgroundColor: colors.primary50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      width: 84,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
    },
    activeButtonText: {
      color: colors.white,
    },
    buttonText: {
      color: colors.neutral400,
    },
  });

export default CategoryTab;
