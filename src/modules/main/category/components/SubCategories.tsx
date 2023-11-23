import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {PRODUCT_SUBCATEGORY} from '../../../../utils/constants';

interface SubCategories {
  currentCategory: string;
}

const SubCategories: React.FC<SubCategories> = ({currentCategory}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  useEffect(() => {
    setSubCategories(PRODUCT_SUBCATEGORY[currentCategory]);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant={'titleSmall'} style={styles.title}>
        Shop By Category
      </Text>

      <FlatList
        horizontal
        data={subCategories}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.brand}>
            <FastImage
              source={{uri: item?.imageUrl}}
              style={styles.brandImage}
            />
            <Text variant={'bodyMedium'}>{item.key}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.value}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 40,
      paddingLeft: 16,
    },
    title: {
      marginBottom: 12,
    },
    brand: {
      width: 160,
      marginRight: 20,
    },
    brandImage: {
      padding: 16,
      borderRadius: 10,
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EDEDED',
      marginBottom: 12,
    },
  });
export default SubCategories;
