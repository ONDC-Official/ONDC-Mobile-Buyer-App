import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';

const CloseSheetContainer = ({
  closeSheet,
  children,
}: {
  closeSheet: () => void;
  children: any;
}) => {
  const styles = makeStyles();

  return (
    <View style={styles.container}>
      <View style={styles.closeSheet}>
        <TouchableOpacity onPress={closeSheet}>
          <View style={styles.closeButton} />
          <Icon
            name={'close-circle'}
            color={'#000'}
            size={32}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    closeSheet: {
      alignItems: 'center',
      paddingBottom: 8,
      paddingTop: 20,
    },
    closeButton: {
      width: 20,
      height: 20,
      backgroundColor: '#fff',
      borderRadius: 32,
      marginLeft: 6,
    },
    closeIcon: {
      marginTop: -26,
    },
  });

export default CloseSheetContainer;
