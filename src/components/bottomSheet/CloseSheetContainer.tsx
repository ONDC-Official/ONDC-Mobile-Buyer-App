import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {useAppTheme} from '../../utils/theme';
import {isIOS} from '../../utils/constants';

const CloseSheetContainer = ({
  closeSheet,
  children,
}: {
  closeSheet: () => void;
  children: any;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeSheet}>
        <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
          <Icon name={'clear'} color={theme.colors.white} size={36} />
        </TouchableOpacity>
      </View>
      {children}
      <Toast config={toastConfig} />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      height: Dimensions.get('screen').height,
      paddingBottom: isIOS ? 16 : 70,
      paddingTop: isIOS ? 32 : 0,
    },
    closeSheet: {
      alignItems: 'center',
      paddingBottom: 8,
      paddingTop: 20,
    },
    closeButton: {
      width: 36,
      height: 36,
      backgroundColor: colors.neutral400,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default CloseSheetContainer;
