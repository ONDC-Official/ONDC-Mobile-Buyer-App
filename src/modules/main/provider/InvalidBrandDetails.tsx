import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppTheme} from '../../../utils/theme';
import InvalidBarcode from '../../../assets/invalid_barcode.svg';

const screenWidth = Dimensions.get('screen').width;

const InvalidBrandDetails = ({route: {params}}: {route: any}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {t} = useTranslation();

  const navigateToHome = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <InvalidBarcode width={100} height={100} />
      <Text variant={'bodySmall'} style={styles.message}>
        {params.message}
      </Text>
      <TouchableOpacity onPress={navigateToHome} style={styles.button}>
        <Text variant={'bodyLarge'} style={styles.buttonText}>
          {t('Provider Details.Go Home')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    message: {
      color: colors.neutral400,
      textAlign: 'center',
      marginTop: 20,
    },
    button: {
      marginTop: 28,
      width: screenWidth - 40,
      marginHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colors.primary,
      paddingVertical: 13,
      paddingHorizontal: 24,
      textAlign: 'center',
    },
    buttonText: {
      color: colors.white,
      textAlign: 'center',
    },
  });

export default InvalidBrandDetails;
