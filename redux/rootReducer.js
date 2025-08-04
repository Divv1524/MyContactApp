import { combineReducers } from 'redux';
import { contactReducer } from './reducer/contactReducer';
import { authReducer } from './reducer/authReducer';

const rootReducer = combineReducers({
  contacts: contactReducer,
  auth: authReducer, 
});

export default rootReducer;
