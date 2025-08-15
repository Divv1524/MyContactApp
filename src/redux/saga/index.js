import { all } from 'redux-saga/effects';
import { watchNewsSaga } from './newsSaga';

// Root saga combines all sagas
export default function* rootSaga() {
  //The yield all([...]) syntax means all the listed sagas will start at the same time, without waiting for one to complete.
  yield all([
    watchNewsSaga(), // Add other watchers here later
  ]);
}
