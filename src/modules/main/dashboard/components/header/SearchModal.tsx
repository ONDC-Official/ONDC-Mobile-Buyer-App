import React from 'react';
import {Modal, Portal, Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MotiView} from '@motify/components';
import {Easing} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import makeStyles from './styles';

type MicrProps = {
  recognizedText: string;
  modalVisible: boolean;
  onStopRecord: () => void;
};

const SearchModal: React.FC<MicrProps> = ({
  recognizedText,
  modalVisible,
  onStopRecord,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={onStopRecord}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onStopRecord}>
            <Icon name="clear" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.micWavesContainer}>
            {[...Array(3).keys()].map(index => {
              return (
                <MotiView
                  from={{opacity: 1, scale: 1}}
                  animate={{opacity: 0, scale: 4}}
                  transition={{
                    type: 'timing',
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    delay: index * 200,
                    repeatReverse: false,
                    loop: true,
                  }}
                  key={index}
                  style={[StyleSheet.absoluteFillObject, styles.micWaves]}
                />
              );
            })}
            <Icon name="mic" size={60} color="#fff" />
          </View>
          <Text variant={'bodyLarge'} style={styles.labelText}>
            {recognizedText?.length > 0
              ? recognizedText
              : t('Home.Try Saying Something, We are Listening')}
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};

export default SearchModal;
