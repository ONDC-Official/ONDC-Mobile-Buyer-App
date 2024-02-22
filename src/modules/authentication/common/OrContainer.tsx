import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useAppTheme} from '../../../utils/theme';

const OrContainer = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text variant={'labelMedium'} style={styles.label}>
        Or
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.neutral200,
    },
    label: {
      color: colors.neutral300,
      paddingHorizontal: 12,
    },
  });

export default OrContainer;
