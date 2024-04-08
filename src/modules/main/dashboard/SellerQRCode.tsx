import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getUrlParams} from '../../../utils/utils';

const SellerQRCode = ({navigation}: {navigation: any}) => {
  const [torchOn, setTorchOn] = useState(false);

  const onQRScan = (event: any) => {
    if (event.data.startsWith('beckn://ondc')) {
      const url = event.data;
      const urlParams = getUrlParams(url);
      if (
        urlParams.hasOwnProperty('context.action') &&
        urlParams['context.action'] === 'search'
      ) {
        const brandId = `${urlParams['context.bpp_id']}_${urlParams['context.domain']}_${urlParams['message.intent.provider.id']}`;
        const pageParams: any = {brandId};
        if (
          urlParams.hasOwnProperty('message.intent.provider.locations.0.id')
        ) {
          pageParams.outletId = `${brandId}_${urlParams['message.intent.provider.locations.0.id']}`;
        }
        navigation.navigate('BrandDetails', pageParams);
      }
    }
  };

  return (
    <QRCodeScanner
      reactivate={false}
      onRead={onQRScan}
      flashMode={
        torchOn
          ? RNCamera.Constants.FlashMode.torch
          : RNCamera.Constants.FlashMode.off
      }
      cameraStyle={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height - 200,
      }}
      topContent={
        <View style={styles.header}>
          <Text variant={'bodyLarge'}>ONDC QR se Bharat Khelega</Text>
          <TouchableOpacity onPress={() => setTorchOn(!torchOn)}>
            <Icon name={torchOn ? 'flash-off' : 'flash-on'} size={24} />
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
});

export default SellerQRCode;
