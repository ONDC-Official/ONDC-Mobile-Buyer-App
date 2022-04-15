import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {withTheme, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {appStyles} from '../../../../styles/styles';

const Header = ({theme, title, show, navigation}) => {
  const {colors} = theme;

  const onPressHandler = () => navigation.navigate('AddAddress');
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.backButton, {backgroundColor: colors.primary}]}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={18} color={colors.white} />
      </TouchableOpacity>
      <View style={appStyles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
      {show && (
        <TouchableOpacity
          style={[styles.button, {borderColor: colors.primary}]}
          onPress={onPressHandler}>
          <Text style={{color: colors.primary}}>ADD</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default withTheme(Header);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {fontSize: 24, fontWeight: '600'},
  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
