import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';

/**
 * Component to render single option card in more screen
 * @param theme: application theme
 * @param action
 * @param item : menu object from  list
 * @constructor
 * @returns {JSX.Element}
 */
const OptionCard = ({theme, action, item}) => {
  const {colors} = theme;

  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => action(item.name)}>
        <Icon type="font-awesome" name={item.icon} color={colors.accentColor}/>
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
