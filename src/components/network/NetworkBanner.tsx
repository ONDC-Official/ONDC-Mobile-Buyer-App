import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useAppTheme} from '../../utils/theme';

const NetworkBanner: React.FC = () => {
  const theme = useAppTheme();
  const [isOffline, setOfflineStatus] = useState<boolean>(false);
  const styles = makeStyles(theme.colors);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => {
      removeNetInfoSubscription();
    };
  }, []);

  if (isOffline) {
    return (
      <View style={styles.bannerContainer}>
        <Text style={styles.messageTitle}>
          Network Banner.You are offline, please verify your internet connection
        </Text>
      </View>
    );
  }

  return <></>;
};

export default NetworkBanner;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    bannerContainer: {
      height: 60,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItem: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors.error600,
    },
    messageTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.white,
    },
  });
