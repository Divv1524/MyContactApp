import { all } from 'redux-saga/effects';
import { watchNewsSaga } from './newsSaga';

// Root saga combines all sagas
export default function* rootSaga() {
  yield all([
    watchNewsSaga(), // Add other watchers here later
  ]);
}
