import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {PermissionsAndroid, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import useBhashiniApi from '../../../../../hooks/useBhashini';
import useFileSystem from '../../../../../hooks/useFileSystem';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import SearchModal from './SearchModal';
import makeStyles from './styles';

type MicProps = {
  onChangeSearch: (query: string) => void;
};

const inputPath = Platform.select({
  ios: undefined,
  android: undefined,
});

const audioRecorderPlayer = new AudioRecorderPlayer();
const thresholdValue = -20;

const SearchHeaderMic: React.FC<MicProps> = ({onChangeSearch}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useTheme();
  const {handleApiError} = useNetworkErrorHandling();
  const {withoutConfigRequest, computeRequestASR} = useBhashiniApi();
  const {fileConvertToBase64, deleteFile} = useFileSystem();
  const styles = makeStyles(theme.colors);

  useEffect(() => {
    withoutConfigRequest();
  });

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    setModalVisible(true);
    await audioRecorderPlayer.startRecorder(inputPath, audioSet, true);

    audioRecorderPlayer.addRecordBackListener(async e => {
      if (e?.currentMetering && e?.currentMetering < thresholdValue) {
        setTimeout(() => {
          onStopRecord();
        }, 1000);
      }
    });
  };

  const onStopRecord = async () => {
    try {
      const url = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      const timeStamp = new Date().getTime();
      const outputPath = RNFS.CachesDirectoryPath + `/sound${timeStamp}.wav`;

      const command = `-i ${url} ${outputPath}`;

      await FFmpegKit.execute(command);
      const base64 = await fileConvertToBase64(outputPath);

      if (base64) {
        const searchText = await computeRequestASR(base64);
        if (searchText?.pipelineResponse[0]?.output[0]?.source) {
          const query = searchText?.pipelineResponse[0]?.output[0]?.source;
          await deleteFile(outputPath);
          onChangeSearch(query);
        }
      }

      setModalVisible(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={onStartRecord} style={styles.micContainer}>
        <Icon name="mic" size={24} color="#fff" />
      </TouchableOpacity>
      <SearchModal modalVisible={modalVisible} onStopRecord={onStopRecord} />
    </>
  );
};

export default SearchHeaderMic;
