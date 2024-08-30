import Voice from '@react-native-voice/voice';
import {useRef, useState} from 'react';

export default (language: string) => {
  const userLatestInteraction = useRef<boolean>(false);
  const [userInteractionStarted, setUserInteractionStarted] =
    useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const allowRestart = useRef<boolean>(true);

  const startVoice = async () => {};

  const stopAndDestroyVoiceListener = async () => {
    try {
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
    allowRestart.current = true;
  };

  return {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  };
};
