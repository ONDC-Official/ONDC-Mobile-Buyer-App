import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../../../utils/theme';
import useFormatDate from '../../../../../hooks/useFormatDate';

const return_end_states = [
  'Return_Delivered',
  'Liquidated',
  'Return_Rejected',
  'Return_Failed',
];

const FulfilmentStatus = ({
  code,
  fulfilment,
}: {
  code: string;
  fulfilment?: any;
}) => {
  const {formatDate} = useFormatDate();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const returnPresent = return_end_states.includes(code);
  return (
    <View style={styles.statusChip}>
      <Text variant={'labelMedium'} style={styles.statusText}>
        {t(`Fulfilment Status.${code}`)}
        {returnPresent
          ? t('Fulfilment Status.on time', {
              time: formatDate(moment(fulfilment?.updatedAt), 'Do MMM'),
            })
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
      backgroundColor: colors.primary50,
    },
    statusText: {
      color: colors.primary,
    },
  });

export default FulfilmentStatus;
