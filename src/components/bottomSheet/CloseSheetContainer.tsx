import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {useAppTheme} from '../../utils/theme';

const CloseSheetContainer = ({
  closeSheet,
  children,
}: {
  closeSheet: () => void;
  children: any;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.closeSheet}>
        <TouchableOpacity onPress={closeSheet}>
          <View style={styles.closeButton} />
          <Icon
            name={'close-circle'}
            color={theme.colors.neutral400}
            size={32}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      height: Dimensions.get('screen').height,
      paddingBottom: 70,
    },
    closeSheet: {
      alignItems: 'center',
      paddingBottom: 8,
      paddingTop: 20,
    },
    closeButton: {
      width: 20,
      height: 20,
      backgroundColor: colors.white,
      borderRadius: 32,
      marginLeft: 6,
    },
    closeIcon: {
      marginTop: -26,
    },
  });

export default CloseSheetContainer;
