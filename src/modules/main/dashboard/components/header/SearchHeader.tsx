import React, {useEffect, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

import {useAppTheme} from '../../../../../utils/theme';
import SearchModal from './SearchModal';
import useBhashiniApi from '../../../../../hooks/useBhashini';
import useFileSystem from '../../../../../hooks/useFileSystem';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';

type SearchHeaderProps = {
  onSearch: (query: string) => void;
  defaultQuery: string;
  backIconPress?: () => void;
};

const inputPath: any = Platform.select({
  ios: undefined,
  android: undefined,
});

const audioRecorderPlayer: AudioRecorderPlayer = new AudioRecorderPlayer();
const thresholdValue: number = -20;

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  defaultQuery,
  backIconPress,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>(defaultQuery);
  const {t} = useTranslation();
  const {withoutConfigRequest, computeRequestASR} = useBhashiniApi();
  const {fileConvertToBase64, deleteFile} = useFileSystem();
  const theme = useAppTheme();
  const {handleApiError} = useNetworkErrorHandling();
  const styles = makeStyles(theme.colors);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onSearchComplete = () => {
    onSearch(searchQuery);
  };

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

  useEffect(() => {
    withoutConfigRequest().then(() => {});
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={backIconPress}
          style={styles.backIconContainer}>
          <Icon name={'arrow-back'} size={24} color={'#fff'} />
        </TouchableOpacity>
        <Searchbar
          editable
          iconColor={theme.colors.primary}
          rippleColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          style={styles.search}
          placeholderTextColor={theme.colors.primary}
          placeholder={t('Home.Search')}
          onChangeText={onChangeSearch}
          onBlur={onSearchComplete}
          value={searchQuery}
          traileringIcon={'microphone'}
          traileringIconColor={theme.colors.primary}
        />
      </View>
      <SearchModal modalVisible={modalVisible} onStopRecord={onStopRecord} />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    searchContainer: {
      width: '100%',
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 44,
    },
    search: {
      flex: 1,
      height: 44,
      backgroundColor: colors.white,
    },
    backIconContainer: {
      marginRight: 12,
    },
  });
export default SearchHeader;
