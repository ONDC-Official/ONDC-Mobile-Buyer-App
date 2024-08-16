import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../utils/theme';

const ProductSearch = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Icon name={'search'} size={20} color={theme.colors.neutral300} />
      <TextInput
        dense
        mode={'outlined'}
        contentStyle={styles.input}
        style={styles.inputContainer}
        placeholder={t('Product SubCategories.Search')}
        placeholderTextColor={theme.colors.neutral300}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        textColor={theme.colors.neutral400}
        outlineColor={theme.colors.neutral100}
        activeUnderlineColor={theme.colors.neutral100}
        underlineColor={theme.colors.neutral100}
      />
      {searchQuery.length === 0 ? (
        <></>
      ) : (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Icon name={'clear'} size={20} color={theme.colors.neutral300} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 60,
      backgroundColor: colors.neutral100,
      paddingHorizontal: 10,
      height: 52,
      alignItems: 'center',
    },
    inputContainer: {
      flex: 1,
      fontSize: 14,
      textDecorationLine: 'none',
      fontWeight: '400',
    },
    input: {
      backgroundColor: colors.neutral100,
    },
  });

export default ProductSearch;
