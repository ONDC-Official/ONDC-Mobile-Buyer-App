import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppTheme} from '../../../utils/theme';

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
      <Text variant={'bodyMedium'}>{params.message}</Text>
      <Button mode={'contained'} onPress={navigateToHome} style={styles.button}>
        {t('Provider Details.Go Home')}
      </Button>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      color: colors.neutral400,
    },
    button: {
      marginTop: 12,
    },
  });

export default InvalidBrandDetails;
