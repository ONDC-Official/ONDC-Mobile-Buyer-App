import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Card, withTheme} from 'react-native-paper';

/**
 * Component to render single option card in more screen
 * @param theme: application theme
 * @param action
 * @param item : menu object from  list
 * @constructor
 * @returns {JSX.Element}
 */
const OptionCard = ({theme, action, item}) => {
  return (
    <Card containerStyle={styles.card}>
      <Button icon={item.icon} onPress={() => action(item.name)}>
        {item.string}
      </Button>
    </Card>
  );
};

export default withTheme(OptionCard);

const styles = StyleSheet.create({
  card: {elevation: 5, borderRadius: 50, paddingHorizontal: 30},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row'},
});
