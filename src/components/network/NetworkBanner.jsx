import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import {appStyles} from '../../styles/styles';

const NetworkBanner = () => {
  const {colors} = useTheme();
  const [isOffline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => {
      removeNetInfoSubscription();
    };
  }, []);

  return (
    <>
      {isOffline ? (
        <View
          style={[{backgroundColor: colors.opposite}, styles.bannerContainer]}>
          <View style={styles.messageContainer}>
            <Text style={[styles.messageTitle]}>
              {'You are offline, please verify your internet connection.'}
            </Text>
          </View>
          <Button
            labelStyle={appStyles.containedButtonLabel}
            contentStyle={[appStyles.containedButtonContainer]}
            style={styles.buttonStyle}
            mode="contained-tonal"
            onPress={() => {
              setOfflineStatus(false);
            }}>
            Ok
          </Button>
        </View>
      ) : (
        <View/>
      )}
    </>
  );
};

export default NetworkBanner;

const styles = StyleSheet.create({
  bannerContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center',
    paddingHorizontal: 16,
  },
  messageContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItem: 'center',
  },
  messageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonStyle: {
    height: 40,
    justifyContent: 'center',
    alignItem: 'center',
    alignSelf: 'center',
  },
});
