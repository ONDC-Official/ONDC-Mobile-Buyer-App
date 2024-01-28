import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const ReturnOrder = ({navigation}: {navigation: any}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'clear'} color={'#1A1A1A'} size={20} />
        </TouchableOpacity>
        <Text variant={'titleSmall'} style={styles.pageTitle}>
          Return Order
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.message} variant={'bodyLarge'}>
          Waiting for UX
        </Text>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    page: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
    },
    pageTitle: {
      marginLeft: 20,
      color: '#1A1A1A',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      color: colors.primary,
    },
  });

export default ReturnOrder;
