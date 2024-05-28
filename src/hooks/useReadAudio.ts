import Voice from '@react-native-voice/voice';
import {useEffect, useRef, useState} from 'react';
import {getLocale} from '../utils/utils';
import {START_AUDIO_LISTENER_COMMAND} from '../utils/constants';

export default (language: string) => {
  const userLatestInteraction = useRef<boolean>(false);
  const [userInteractionStarted, setUserInteractionStarted] =
    useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const allowRestart = useRef<boolean>(true);

  const onSpeechResults = async (event: any) => {
    console.log('onSpeechResults', userInteractionStarted, event.value);
    if (!userLatestInteraction.current) {
      const isPresent = START_AUDIO_LISTENER_COMMAND.includes(
        event.value[0].toLowerCase(),
      );
      setUserInteractionStarted(isPresent);
      userLatestInteraction.current = isPresent;
    } else {
      setUserInput(event.value[0]);
    }
    await restartVoice();
  };

  const restartVoice = async () => {
    try {
      console.log('allowRestart.current', allowRestart.current);
      if (allowRestart.current) {
        await Voice.stop();
        await startVoice();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startVoice = async () => {
    console.log('Start voice');
    try {
      await Voice.destroy();
      const locale = getLocale(language);
      await Voice.start(locale); // Start listening for Hindi speech
    } catch (error) {
      console.error(error);
    }
  };

  const onSpeechEnd = async () => {
    console.log('onSpeechEnd');
  };

  const onSpeechError = async () => {
    console.log('onSpeechError');
    await restartVoice();
  };

  const stopAndDestroyVoiceListener = async () => {
    try {
      console.log('Inside stop and destroy');
      setUserInteractionStarted(false);
      userLatestInteraction.current = false;
      allowRestart.current = false;
      await Voice.stop();
      await Voice.destroy();
    } catch (error) {
      console.error(error);
    }
  };

  const setAllowRestarts = () => {
    console.log('Set Allow restart called');
    allowRestart.current = true;
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  };
};
