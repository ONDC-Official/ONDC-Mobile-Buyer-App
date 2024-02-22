import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {CATEGORIES} from '../../../../../utils/categories';
import {useAppTheme} from '../../../../../utils/theme';

const Categories = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToCategoryDetails = (category: string, domain: string) => {
    navigation.navigate('CategoryDetails', {category, domain});
  };

  return (
    <View>
      <View style={styles.header}>
        <Text variant={'titleMedium'} style={styles.title}>
          Featured Categories
        </Text>
        <TouchableOpacity style={styles.viewAllContainer}>
          <Text variant={'bodyMedium'} style={styles.viewAllLabel}>
            View All
          </Text>
          <Icon
            name={'keyboard-arrow-right'}
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={CATEGORIES}
        numColumns={4}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() =>
              navigateToCategoryDetails(item.shortName, item.domain)
            }>
            <FastImage source={item.Icon} style={styles.imageContainer} />
            <Text variant={'labelMedium'} style={styles.categoryText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    categoryText: {
      color: colors.neutral400,
      textAlign: 'center',
    },
    category: {
      marginHorizontal: 16,
      marginTop: 12,
      flex: 1,
      alignItems: 'center',
    },
    imageContainer: {
      height: 67,
      width: 67,
    },
    viewAllContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 20,
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

export default Categories;
