import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../utils/theme';
import {useTranslation} from 'react-i18next';

const SectionHeaderWithViewAll = ({
  title,
  viewAll,
}: {
  title: string;
  viewAll: () => void;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.header}>
      <Text variant={'titleLarge'} style={styles.title}>
        {title}
      </Text>
      <TouchableOpacity style={styles.viewAllContainer} onPress={viewAll}>
        <Text variant={'bodyMedium'} style={styles.viewAllLabel}>
          {t('Home.View All')}
        </Text>
        <Icon
          name={'keyboard-arrow-right'}
          size={18}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    viewAllContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    header: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: colors.neutral400,
    },
    viewAllLabel: {
      color: colors.neutral400,
    },
  });

export default SectionHeaderWithViewAll;
