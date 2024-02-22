import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import moment from 'moment';
import {useAppTheme} from '../../../../../utils/theme';

const return_end_states = [
  'Return_Delivered',
  'Liquidated',
  'Return_Rejected',
  'Return_Failed',
];

const ReturnStatus = ({code, fulfilment}: {code: string; fulfilment?: any}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.statusChip}>
      <Text variant={'labelMedium'} style={styles.statusText}>
        {code}{' '}
        {return_end_states.includes(code)
          ? moment(fulfilment?.updatedAt).format('Do MMM')
          : ''}
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
