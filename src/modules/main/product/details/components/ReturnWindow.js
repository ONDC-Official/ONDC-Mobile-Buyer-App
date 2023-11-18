import {Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {durationToHumanReadable} from '../../../../../utils/utils';

const ReturnWindow = ({duration, theme}) => {
  const {timeDuration, unit} = durationToHumanReadable(duration);

  return (
    <View style={styles.container}>
      <Text>Return Window:&nbsp;</Text>
      <Text variant="titleSmall" style={{color: theme.colors.opposite}}>
        {timeDuration} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default withTheme(ReturnWindow);
