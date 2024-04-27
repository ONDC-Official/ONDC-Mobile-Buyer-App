import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import Store from './components/Store';
import {useAppTheme} from '../../../utils/theme';
import Page from '../../../components/page/Page';

const StoresNearMe = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {locations} = useSelector(({storeReducer}) => storeReducer);

  useEffect(() => {
    navigation.setOptions({
      title: t('Stores Near me.Stores Near me'),
    });
  }, []);

  const renderItem = ({item}: {item: any}) => <Store store={item} />;

  return (
    <Page>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={locations}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      flex: 1,
    },
  });

export default StoresNearMe;
