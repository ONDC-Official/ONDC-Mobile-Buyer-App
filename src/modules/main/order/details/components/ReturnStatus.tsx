import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';

const ReturnStatus = ({code}: {code: string}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.statusChip}>
      <Text variant={'labelMedium'} style={styles.statusText}>
        {code}
      </Text>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    statusChip: {
      borderRadius: 26,
      paddingVertical: 2,
      paddingHorizontal: 8,
      backgroundColor: '#ECF3F8',
    },
    statusText: {
      color: colors.primary,
    },
  });

export default ReturnStatus;
