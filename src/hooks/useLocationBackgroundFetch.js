import Geolocation from 'react-native-geolocation-service';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {alertWithOneButton} from '../utils/alerts';

const useLocationBackgroundFetch = () => {
  // Function to get the current location
  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        alertWithOneButton(
          'Location Permission Required',
          'Please provide access to location',
          'Ok',
          () => Linking.openSettings(),
        );
        return null;
      }
      const providers = await DeviceInfo.getAvailableLocationProviders();
      if (!providers.gps) {
        alertWithOneButton(
          'GPS Permission Required',
          'To continue turn on device location',
          'Ok',
          () => {},
        );
        return null;
      }
    }

    // Get current location
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          showLocationDialog: true,
        },
      );
    });
  };

  return {
    getCurrentLocation,
  };
};

export default useLocationBackgroundFetch;
