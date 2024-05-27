import React, {useEffect, useState} from 'react';
import {Modal, Portal, Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MotiView} from '@motify/components';
import {Easing} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import Voice from '@react-native-voice/voice';
import {useSelector} from 'react-redux';
import makeStyles from './styles';
import {getLocale} from '../../../../../utils/utils';

type MicrProps = {
  modalVisible: boolean;
  onSearchComplete: (value: string) => void;
  closeModal: () => void;
};

const SearchModal: React.FC<MicrProps> = ({
  modalVisible,
  onSearchComplete,
  closeModal,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {language} = useSelector(({authReducer}) => authReducer);
  const [recognizedText, setRecognizedText] = useState('');

  const startVoice = async () => {
    try {
      await Voice.destroy();
      const locale = getLocale(language);
      await Voice.start(locale); // Start listening for Hindi speech
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    startVoice().then(() => {});

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechPartialResults = (event: any) => {
    setRecognizedText(event.value[0]); // Set the recognized text
  };

  const onSpeechResults = (event: any) => {
    setRecognizedText(event.value[0]); // Set the recognized text
    onStopRecord().then(() => {});
    onSearchComplete(event.value[0]);
    closeModal();
  };

  const onStopRecord = async () => {
    setRecognizedText('');
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={closeModal}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={closeModal}>
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
