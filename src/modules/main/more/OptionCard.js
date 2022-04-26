import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import {OPTIONS} from '../../../utils/Constants';

const OptionCard = ({theme, navigation, item}) => {
  const {colors} = theme;
  const {
    state: {token},
    logoutUser,
  } = useContext(AuthContext);

  const onPressHandler = option => {
    if (option === OPTIONS.LOG_OUT) {
      logoutUser();
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
      });
    }
  };
  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onPressHandler(item.name);
        }}>
        <Icon type="font-awesome" name={item.icon} color={colors.accentColor} />
        <Text style={[styles.text, {color: colors.accentColor}]}>
          {item.string}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(OptionCard);

const styles = StyleSheet.create({
  card: {elevation: 5, borderRadius: 50, paddingHorizontal: 30},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row'},
});
