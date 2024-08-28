import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {useAppTheme} from '../../utils/theme';

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
      <Text
        variant={'titleLarge'}
        style={styles.title}
        ellipsizeMode={'tail'}
        numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.separatorContainer}>
        <LinearGradient
          colors={['#B5B5B5ff', '#B5B5B500']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradient}
        />
      </View>
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
    separatorContainer: {
      height: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    gradient: {
      height: 1,
      width: '100%',
    },
    header: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: colors.neutral400,
    },
    viewAllLabel: {
      color: colors.neutral400,
    },
  });

export default SectionHeaderWithViewAll;
