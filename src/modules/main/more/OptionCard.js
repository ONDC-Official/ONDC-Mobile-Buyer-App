import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';

const OptionCard = ({theme, item}) => {
  const {colors} = theme;
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Icon type="font-awesome" name={item.icon} color={colors.primary} />
        <Text style={[styles.text, {color: colors.primary}]}>{item.name}</Text>
      </View>
    </Card>
  );
};

export default withTheme(OptionCard);

const styles = StyleSheet.create({
  card: {elevation: 5},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row'},
});
