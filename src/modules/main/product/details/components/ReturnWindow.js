import {Text} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import React from 'react';
import {durationToHumanReadable} from '../../../../../utils/utils';

const ReturnWindow = ({duration}) => {
  const {timeDuration, unit} = durationToHumanReadable(duration);

  return (
    <View style={styles.container}>
      <Text>Return Window:&nbsp;</Text>
      <Text variant="titleSmall">
        {timeDuration} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reqsRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
});

export default ReturnWindow;
