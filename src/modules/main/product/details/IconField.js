import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconField = ({name, theme, icon}) => {
  const {colors} = theme;
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: colors.statusBackground},
        ]}>
        <Icon name={icon} size={25} color={colors.primary}/>
      </View>
      <Text style={[styles.text, {color: colors.primary}]}>{name}</Text>
    </View>
  );
};

export default withTheme(IconField);

const styles = StyleSheet.create({
  iconContainer: {
    height: 45,
    width: 45,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 10,
  },
  text: {fontSize: 16},
  container: {flexDirection: 'row', alignItems: 'center'},
});
