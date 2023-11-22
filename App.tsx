import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/redux/store';
import {theme} from './src/utils/theme';
import Navigation from './src/navigation/Navigation';
import NetworkBanner from './src/components/network/NetworkBanner';

const App = () => {
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={theme.colors.primary} />
          <Navigation />
          <NetworkBanner />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </PaperProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
