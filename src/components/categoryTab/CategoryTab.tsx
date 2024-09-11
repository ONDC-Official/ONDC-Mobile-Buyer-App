import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

interface CategoryTab {
  searchType: string;
  setSearchType: (values: any) => void;
}

const CategoryTab: React.FC<CategoryTab> = ({searchType, setSearchType}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.switchRow}>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setSearchType('Stores')}
          style={[
            styles.button,
            searchType === 'Stores' ? styles.activeButton : {},
          ]}>
          <Text
            variant={'bodyMedium'}
            style={
              searchType === 'Stores'
                ? styles.activeButtonText
                : styles.buttonText
            }>
            {t('Search.Stores')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSearchType('Products')}
          style={[
            styles.button,
            searchType === 'Products' ? styles.activeButton : {},
          ]}>
          <Text
            variant={'bodyMedium'}
            style={
              searchType === 'Products'
                ? styles.activeButtonText
                : styles.buttonText
            }>
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
    },
    switchContainer: {
      height: 28,
      width: 168,
      borderRadius: 39,
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
      borderRadius: 39,
    },
    activeButtonText: {
      color: colors.white,
    },
    buttonText: {
      color: colors.neutral400,
    },
  });

export default CategoryTab;
