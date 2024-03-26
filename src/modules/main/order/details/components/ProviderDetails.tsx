import {Button, Text} from 'react-native-paper';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FB_DOMAIN} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const ProviderDetails = ({
  bppId,
  domain,
  provider,
  cancelled = false,
  documents,
}: {
  bppId: any;
  domain: any;
  provider: any;
  cancelled?: boolean;
  documents: any[];
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const callProvider = () => Linking.openURL('tel:+91 92729282982');

  const navigateToProvider = () => {
    const routeParams: any = {
      brandId: `${bppId}_${domain}_${provider?.id}`,
    };

    if (domain === FB_DOMAIN) {
      routeParams.outletId = provider?.locations[0]?.id;
    }
    navigation.navigate('BrandDetails', routeParams);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.providerMeta}
          onPress={navigateToProvider}>
          <FastImage
            source={{uri: provider?.descriptor?.symbol}}
            style={styles.providerImage}
          />
          <Text variant={'headlineSmall'} style={styles.providerName}>
            {provider?.descriptor?.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={callProvider}>
          <Icon name={'call'} size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      {cancelled && (
        <>
          <View style={styles.cancelContainer}>
            <Icon name={'cancel'} size={20} color={theme.colors.error} />
            <Text variant={'bodyMedium'} style={styles.cancelledLabel}>
              {t('Provider Details.Order Cancelled')}
            </Text>
          </View>
          {!!documents && (
            <Button
              mode={'outlined'}
              contentStyle={styles.downloadButtonContent}
              style={styles.downloadButton}
              onPress={() => Linking.openURL(documents[0]?.url)}>
              Download Invoice
            </Button>
          )}
        </>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      padding: 16,
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
      color: colors.neutral400,
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
    cancelContainer: {
      borderColor: colors.error600,
      borderRadius: 8,
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.error50,
      marginTop: 8,
    },
    cancelledLabel: {
      color: colors.error600,
      marginLeft: 8,
    },
    downloadButtonContent: {
      height: 36,
    },
    downloadButton: {
      marginTop: 16,
      borderRadius: 8,
      borderColor: colors.primary,
    },
  });

export default ProviderDetails;
