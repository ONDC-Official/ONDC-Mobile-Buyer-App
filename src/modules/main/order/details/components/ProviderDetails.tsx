import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const ProviderDetails = ({provider}: {provider: any}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.providerMeta}>
          <FastImage
            source={{uri: provider?.descriptor?.symbol}}
            style={styles.providerImage}
          />
          <Text variant={'titleMedium'} style={styles.providerName}>
            {provider?.descriptor?.name}
          </Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Icon name={'call'} size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E8E8E8',
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      marginTop: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    providerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    providerName: {
      flex: 1,
    },
    providerImage: {
      width: 30,
      height: 30,
      marginRight: 8,
    },
    callButton: {
      width: 28,
      height: 28,
      borderWidth: 1,
      borderRadius: 28,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ProviderDetails;
