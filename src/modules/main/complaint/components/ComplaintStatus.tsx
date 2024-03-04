import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-paper';
import {useAppTheme} from '../../../../utils/theme';

const ComplaintStatus = ({status}: {status: string}) => {
  const theme = useAppTheme();
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
      backgroundColor: colors.error50,
    },
    statusCloseChip: {
      backgroundColor: colors.success50,
    },
    statusOpen: {
      color: colors.error600,
    },
    statusClose: {
      color: colors.success600,
    },
  });

export default ComplaintStatus;
