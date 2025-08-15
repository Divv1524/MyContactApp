/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { name as appName } from './app.json';
import { persistor, store } from './src/redux/store';

const AppRedux = () => (
    
  <Provider store={store}> // Wraps your entire app with Redux store access.
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppRedux);
