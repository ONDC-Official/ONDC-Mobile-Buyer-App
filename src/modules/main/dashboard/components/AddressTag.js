import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const AddressTag = ({address, theme}) => {
  const navigation = useNavigation();

  if (address) {
    return (
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={() => navigation.navigate('AddressList')}>
        <Text
          variant="titleMedium"
          style={[styles.address, {color: theme.colors.primary}]}>
          {address?.address?.tag
            ? address?.address?.tag
            : address?.address?.city}
        </Text>
        <Icon name={'chevron-down'} color={theme.colors.primary} />
      </TouchableOpacity>
    );
  } else {
    return <ActivityIndicator size={'small'} color={theme.colors.primary} />;
  }
};

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginEnd: 8,
  },
});

export default withTheme(AddressTag);
