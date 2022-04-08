import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const image = require('../../../assets/demo.png');
const addButton = strings('main.product.add_button_title');

const ProductListCard = ({theme}) => {
  const {colors} = theme;
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <FastImage source={image} style={styles.image} />
        <View style={[appStyles.container, styles.detailsContainer]}>
          <Text>Blender tee</Text>
          <Text>Large</Text>
          <Text>$400</Text>
        </View>
        <View style={styles.buttonContainer}>
          {
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.primary}]}>
              <Text style={{color: colors.primary}}>{addButton}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );
};

export default withTheme(ProductListCard);

const styles = StyleSheet.create({
  container: {marginTop: 10, padding: 10},
  subContainer: {flexDirection: 'row'},
  image: {height: 80, width: 80, marginRight: 10},
  detailsContainer: {justifyContent: 'space-between'},
  buttonContainer: {justifyContent: 'flex-end'},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
  },
});
