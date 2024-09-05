import React, {useEffect, useRef, useState} from 'react';
import {Modal, Portal, Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import Voice from '@react-native-voice/voice';
import {useSelector} from 'react-redux';
import {getLocale} from '../../../../../utils/utils';
import MicWave from './MicWave';

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
  const speechDetected = useRef(false);
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {language} = useSelector(({auth}) => auth);
  const [recognizedText, setRecognizedText] = useState('');

  const startVoice = async () => {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      await new Promise(resolve => setTimeout(resolve, 300));
      const locale = getLocale(language);
      await Voice.start(locale);
      speechDetected.current = false;
    } catch (error) {
      console.error('Error during voice start:', error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;

    startVoice().then(() => {});

    return () => {
      Voice.destroy().then(() => {
        Voice.removeAllListeners();
      });
    };
  }, []);

  const onSpeechEnd = () => {
    setTimeout(() => {
      if (!speechDetected.current) {
        startVoice().then(() => {});
      }
    }, 500);
  };

  const onSpeechPartialResults = (event: any) => {
    setRecognizedText(event.value[0]); // Set the recognized text
  };

  const onSpeechResults = (event: any) => {
    speechDetected.current = true;
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
            <MicWave />
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    modalView: {
      alignSelf: 'center',
      height: 350,
      width: 300,
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    micWavesContainer: {
      width: 60,
      height: 60,
      borderRadius: 75,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 75,
    },
    labelText: {
      marginTop: 100,
      textAlign: 'center',
    },
  });

export default SearchModal;
