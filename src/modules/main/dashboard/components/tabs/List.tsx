import {Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

const List = () => {
  const {t} = useTranslation();
  const styles = makeStyles();
  return (
    <View style={styles.container}>
      <Text>{t('List.Coming soon')}</Text>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default List;
