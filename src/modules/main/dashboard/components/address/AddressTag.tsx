import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Logo from '../../../../../assets/dashboard/ONDClogo.svg';

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
        <Logo height={32} width={32} />
        <Text variant={'bodyMedium'} style={styles.deliverTo}>
          {address?.address?.tag ? address?.address?.tag : t('Home.Deliver to')}
          {' - '}
          {address?.address?.areaCode
            ? address?.address?.areaCode
            : address?.address?.city}
        </Text>
        <Icon
          name={'keyboard-arrow-down'}
          color={theme.colors.neutral50}
          size={24}
        />
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
      marginRight: 6,
      color: colors.neutral50,
    },
  });

export default AddressTag;
