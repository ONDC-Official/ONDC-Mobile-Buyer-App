import {Modal, Portal, Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Pdf from 'react-native-pdf';

import {useAppTheme} from '../../../../../utils/theme';

const SizeChart = ({
  sizeChart = '',
  closeSizeChart,
}: {
  sizeChart: string;
  closeSizeChart: () => void;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [imageLoadFailed, setImageLoadFailed] = useState(true);

  return (
    <Portal>
      <Modal
        visible
        onDismiss={closeSizeChart}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text variant={'bodyLarge'}>{t('Variations.Size Guide')}</Text>
          <TouchableOpacity onPress={closeSizeChart}>
            <MaterialIcons name={'clear'} size={24} />
          </TouchableOpacity>
        </View>
        <View>
          {imageLoadFailed ? (
            <Pdf
              trustAllCerts={false}
              source={{uri: sizeChart}}
              style={styles.chartImage}
            />
          ) : (
            <FastImage
              source={{uri: sizeChart}}
              style={styles.chartImage}
              onError={() => {
                setImageLoadFailed(true);
              }}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    contentContainer: {
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      marginRight: 10,
    },
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    details: {
      padding: 16,
    },
    title: {
      color: colors.neutral400,
      marginBottom: 12,
    },
    price: {
      color: colors.neutral400,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    maximumAmount: {
      color: colors.neutral300,
      marginLeft: 12,
      textDecorationLine: 'line-through',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addToCartContainer: {
      marginTop: 28,
    },
    addToCartButton: {
      flex: 1,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      backgroundColor: colors.primary,
    },
    addToCartLabel: {
      color: colors.white,
    },
    buttonGroup: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
    },
    incrementButton: {
      paddingHorizontal: 12,
    },
    quantity: {
      color: colors.primary,
      marginHorizontal: 20,
    },
    modalContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
      borderRadius: 20,
      margin: 20,
      alignItems: 'center',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    chartImage: {
      width: '100%',
      aspectRatio: 1,
    },
  });

export default SizeChart;
