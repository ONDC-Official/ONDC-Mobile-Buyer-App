import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {appStyles} from '../../../../styles/styles';
import BurgerImage from '../../../../assets/burger.svg';
import GroceryImage from '../../../../assets/grocery.svg';

const Home = ({theme}) => {
  const navigation = useNavigation();
  return (
    <View style={appStyles.container}>
      <View style={styles.categories}>
        <Pressable
          onPress={() =>
            navigation.navigate('SearchProductList', {
              category: 'F&B',
              categoryName: 'Food & Beverage',
            })
          }>
          <Card style={{backgroundColor: theme.colors.surface}}>
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.imageContainer,
                  {backgroundColor: theme.colors.foodAndBeverages},
                ]}>
                <BurgerImage width={110} height={110} />
              </View>
              <Text style={styles.categoryName}>Food & Beverage</Text>
            </View>
          </Card>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('SearchProductList', {
              category: 'grocery',
              categoryName: 'Grocery',
            })
          }>
          <Card style={{backgroundColor: theme.colors.surface}}>
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.imageContainer,
                  {backgroundColor: theme.colors.grocery},
                ]}>
                <GroceryImage width={110} height={110} />
              </View>
              <Text style={styles.categoryName}>Grocery</Text>
            </View>
          </Card>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  imageContainer: {
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default withTheme(Home);
