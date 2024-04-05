import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Voice from '@react-native-voice/voice';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../../utils/theme';
import SearchModal from './SearchModal';

const getLocale = (code: string) => {
  switch (code) {
    case 'en':
      return 'en-US';

    case 'hi':
      return 'hi-IN';

    case 'mr':
      return 'mr-IN';

    case 'ta':
      return 'ta-IN';

    case 'bn':
      return 'bn-IN';
  }
};

const AudioRecorder = ({
  setSearchQuery,
  onSearchComplete,
}: {
  setSearchQuery: (value: string) => void;
  onSearchComplete: (value: string) => void;
}) => {
  const {language} = useSelector(({authReducer}) => authReducer);
  const theme = useAppTheme();
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState('');

  const openVoiceModal = async () => {
    setShowVoiceModal(true);
    try {
      const locale = getLocale(language);
      await Voice.start(locale); // Start listening for Hindi speech
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechPartialResults = (event: any) => {
    console.log('partial');
    setRecognizedText(event.value[0]); // Set the recognized text
  };

  const onSpeechResults = (event: any) => {
    console.log('onSpeechResults', event.value[0]);
    setRecognizedText(event.value[0]); // Set the recognized text
    setSearchQuery(event.value[0]);
    console.log('Search complete called');
    onSearchComplete(event.value[0]);
    onStopRecord().then(() => {});
  };

  const onStopRecord = async () => {
    console.log('stop');
    setShowVoiceModal(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={openVoiceModal}>
        <Icon name={'mic'} color={theme.colors.white} size={24} />
      </TouchableOpacity>
      <SearchModal
        recognizedText={recognizedText}
        modalVisible={showVoiceModal}
        onStopRecord={onStopRecord}
      />
    </>
  );
};

export default AudioRecorder;
