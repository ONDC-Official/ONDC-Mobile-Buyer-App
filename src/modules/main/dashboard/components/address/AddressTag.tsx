import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../../utils/theme';

interface AddressTag {}

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
        <Icon name={'location-pin'} color={theme.colors.white} size={20} />
        <Text variant={'bodySmall'} style={styles.deliverTo}>
          Deliver to
        </Text>
        <Text variant={'bodyLarge'} style={styles.address}>
          {address?.address?.areaCode
            ? address?.address?.areaCode
            : address?.address?.city}
        </Text>
        <Icon name={'arrow-down'} color={theme.colors.neutral50} />
      </TouchableOpacity>
    );
  } else {
    return <ActivityIndicator size={'small'} color={theme.colors.neutral50} />;
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deliverTo: {
      marginHorizontal: 4,
      color: colors.neutral50,
    },
    address: {
      marginEnd: 8,
      color: colors.neutral50,
    },
  });

export default AddressTag;
