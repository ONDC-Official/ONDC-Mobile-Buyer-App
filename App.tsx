import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/toolkit/store';
import {theme} from './src/utils/theme';
import AppNavigation from './src/navigation/AppNavigation';
import NetworkBanner from './src/components/network/NetworkBanner';

const toastConfig = {
  error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.topSafeArea} />
        <SafeAreaView style={styles.bottomSafeArea}>
          <StatusBar backgroundColor={theme.colors.primary} />
          <AppNavigation />
          <NetworkBanner />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </PaperProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: theme.colors.primary,
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

export default App;
