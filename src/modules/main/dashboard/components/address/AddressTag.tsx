import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useAppTheme} from '../../../../../utils/theme';

interface AddressTag {
  onPress?: () => void;
}

const AddressTag: React.FC<AddressTag> = ({onPress}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);

  if (address) {
    return (
      <TouchableOpacity style={styles.addressContainer} onPress={onPress}>
        <FastImage
          source={require('../../../../../assets/ONDClogo.png')}
          style={styles.headerImage}
          resizeMode={'contain'}
        />
        <Text variant={'bodySmall'} style={styles.deliverTo}>
          {t('Home.Deliver to')}{' '}
        </Text>
        <Text variant={'bodyLarge'} style={styles.address}>
          {address?.address?.areaCode
            ? address?.address?.areaCode
            : address?.address?.city}
        </Text>
        <Icon name={'keyboard-arrow-down'} color={theme.colors.neutral50} />
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
      marginLeft: 20,
      color: colors.neutral50,
    },
    address: {
      marginEnd: 8,
      color: colors.white,
    },
    headerImage: {
      width: 32,
      height: 32,
      objectFit: 'contain',
    },
  });

export default AddressTag;
