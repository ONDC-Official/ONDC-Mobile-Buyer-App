import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';

const OptionCard = ({theme, navigation, item}) => {
  const {colors} = theme;
  const {
    state: {token},
    logoutUser,
  } = useContext(AuthContext);
  return (
    <Card style={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          logoutUser();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }}>
        <Icon type="font-awesome" name={item.icon} color={colors.primary} />
        <Text style={[styles.text, {color: colors.primary}]}>{item.name}</Text>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(OptionCard);

const styles = StyleSheet.create({
  card: {elevation: 5},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row'},
});
