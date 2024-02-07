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
      paddingVertical: 2,
    },
    statusOpenChip: {
      backgroundColor: '#FFEBEB',
    },
    statusCloseChip: {
      backgroundColor: '#E8FCF1',
    },
    statusOpen: {
      color: '#D83232',
      fontSize: 11,
    },
    statusClose: {
      color: '#419E6A',
      fontSize: 11,
    },
  });

export default ComplaintStatus;
