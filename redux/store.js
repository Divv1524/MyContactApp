import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Reducers
import authReducer from './slice/authSlices';
import contactReducer from './slice/contactSlices';
import newsReducer from './slice/newsSlices';


// Saga root
import rootSaga from './saga';

//Create Saga middleware
const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();

//Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  contacts: contactReducer,
  news: newsReducer,
});

//Configure persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'contacts'], // persist only these (NOT news)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // disable thunk
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

//Run the root saga
sagaMiddleware.run(rootSaga);

//Persistor
export const persistor = persistStore(store);
