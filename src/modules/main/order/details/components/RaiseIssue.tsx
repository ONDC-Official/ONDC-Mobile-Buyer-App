import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';
import RaiseComplaint from '../../../../../assets/raise_complaint.svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RaiseIssue = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <TouchableOpacity style={styles.container}>
      <RaiseComplaint width={42} height={42} />
      <Text variant={'titleSmall'} style={styles.title}>
        Raise Issue
      </Text>
      <Icon name={'chevron-right'} size={20} color={'#686868'} />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginHorizontal: 16,
    },
    title: {
      marginLeft: 8,
      color: '#1A1A1A',
      flex: 1,
    },
  });

export default RaiseIssue;
