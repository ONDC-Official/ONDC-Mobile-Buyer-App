import React from 'react';
import Toast, {ErrorToast} from "react-native-toast-message";
import {Provider as PaperProvider} from "react-native-paper";
import {Provider as StoreProvider} from "react-redux";
import store from "./src/redux/store";
import {theme} from "./src/utils/theme";
import Navigation from "./src/navigation/Navigation";
import NetworkBanner from "./src/components/network/NetworkBanner";


const App = () => {
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2}/>,
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation/>
        <NetworkBanner/>
        <Toast config={toastConfig}/>
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
