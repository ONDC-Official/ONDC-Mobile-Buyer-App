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
    contentContainer: {
      paddingBottom: 24,
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
