import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

import {durationToHumanReadable} from '../../../../../utils/utils';

const TimeToShip = ({duration, theme}) => {
  const {timeDuration, unit} = durationToHumanReadable(duration);

  return (
    <View style={[styles.timeRequired]}>
      <View>
        <Text variant="titleMedium" style={styles.timeRequiredLabel}>
          {timeDuration}
        </Text>
        <Text variant="titleMedium" style={styles.timeRequiredLabel}>
          {unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeRequired: {
    marginTop: 8,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRequiredLabel: {
    color: 'black',
    lineHeight: 16,
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
});

export default withTheme(TimeToShip);
