import {StyleSheet} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';

const ComplaintStatus = ({status}: {status: string}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  if (status === 'Close') {
    return (
      <Chip
        compact
        style={[styles.statusChip, styles.statusCloseChip]}
        textStyle={styles.statusClose}>
        {status}
      </Chip>
    );
  } else {
    return (
      <Chip
        compact
        style={[styles.statusChip, styles.statusOpenChip]}
        textStyle={styles.statusOpen}>
        {status}
      </Chip>
    );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    statusChip: {
      borderRadius: 21,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    statusOpenChip: {
      backgroundColor: '#E8FCF1',
      color: '#419E6A',
    },
    statusCloseChip: {
      backgroundColor: '#E8FCF1',
      color: '#419E6A',
    },
    statusOpen: {
      color: '#419E6A',
    },
    statusClose: {
      color: '#419E6A',
    },
  });

export default ComplaintStatus;
