import { LOGIN, LOGOUT } from '../constants/authConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = () => async (dispatch) => {
  await AsyncStorage.setItem('LOGIN_STATUS', 'true');
  dispatch({ type: LOGIN });
};

export const logout = () => async (dispatch) => {
  await AsyncStorage.setItem('LOGIN_STATUS', 'false');
  dispatch({ type: LOGOUT });
};
