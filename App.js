import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigation from '#navigation/Index';
import store from '#redux/store';
import { colors } from '#res/colors';

const App = () => {
  LogBox.ignoreLogs(['Require cycle: node_modules', 'VirtualizedLists', 'Non-serializable values']);
  return (
    <Provider store={store}>
      <StatusBar backgroundColor={colors.secondary} />
      <AppNavigation />
    </Provider>
  );
};

export default App;
