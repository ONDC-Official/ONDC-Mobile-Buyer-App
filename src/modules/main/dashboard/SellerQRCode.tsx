import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Text} from 'react-native-paper';

import {useAppTheme} from '../../../utils/theme';

const SellerQRCode = ({navigation, route}: {navigation: any; route: any}) => {
  const {handleDeepLink} = route.params;
  const theme = useAppTheme();
  const [torchOn, setTorchOn] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    requestCameraPermission().then(() => {});
  }, []);

  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
      if (result === RESULTS.GRANTED) {
        setHasCameraPermission(true);
      } else {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to scan QR codes.',
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.error('Failed to request camera permission:', error);
    }
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onQRScan = (event: any) => {
    handleDeepLink(event.data);
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.permissionView}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <>
      <QRCodeScanner
        reactivate={false}
        onRead={onQRScan}
        flashMode={
          torchOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        cameraStyle={styles.container}
      />
      <View style={[styles.container, styles.metaContainer]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Icon name={'clear'} size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTorchOn(!torchOn)}>
            <Icon
              name={torchOn ? 'flash-off' : 'flash-on'}
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.emptyContainer} />
          <View style={styles.cameraContainer}>
            <View style={styles.camera} />
          </View>
          <View style={styles.emptyContainer} />
        </View>
        <View style={styles.footer} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  permissionView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  metaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 66,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0,0,0.5)',
  },
  content: {
    flexDirection: 'row',
    height: 276,
  },
  footer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0,0,0.5)',
  },
  cameraContainer: {
    width: 276,
    height: 276,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#fff',
    padding: 18,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0,0,0.5)',
  },
  camera: {
    width: 240,
    height: 240,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
});

export default SellerQRCode;
