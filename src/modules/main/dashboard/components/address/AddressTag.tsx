import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../../utils/theme';

interface AddressTag {
  theme: any;
}

const AddressTag: React.FC<AddressTag> = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const navigation = useNavigation<StackNavigationProp<any>>();

  if (address) {
    return (
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={() => navigation.navigate('AddressList')}>
        <Icon name={'map-marker-alt'} color={'#fff'} size={20} />
        <Text variant={'bodySmall'} style={styles.deliverTo}>
          Deliver to
        </Text>
        <Text variant={'bodyMedium'} style={styles.address}>
          {address?.address?.areaCode
            ? address?.address?.areaCode
            : address?.address?.city}
        </Text>
        <Icon name={'chevron-down'} color={'#fff'} />
      </TouchableOpacity>
    );
  } else {
    return <ActivityIndicator size={'small'} color={'#fff'} />;
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deliverTo: {
      marginHorizontal: 8,
      color: '#fff',
      fontWeight: '400',
    },
    address: {
      marginEnd: 8,
      color: '#fff',
      fontWeight: '500',
    },
  });

export default AddressTag;
