import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  fetchNewsFailure,
  fetchNewsRequest,
  fetchNewsSuccess,
} from '../slice/newsSlices';

// Replace with your actual API key
const API_KEY = '5e34707303fd4b349245e67ec196d41d';

const getNewsState = (state) => state.news;

function* fetchNewsWorker() {
  try {
    // Get current state (pagination & filter values)
    const { page, pageSize, fromDate, toDate } = yield select(getNewsState);

    // Build URL dynamically
    let url = `https://newsapi.org/v2/everything?domains=wsj.com&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;

    if (fromDate) {
      url += `&from=${fromDate}`;
    }
    if (toDate) {
      url += `&to=${toDate}`;
    }

    // Fetch data using fetch
    const response = yield call(fetch, url);
    const data = yield response.json();

    if (response.ok && data.articles) {
      const hasMore = data.articles.length === pageSize && page * pageSize < data.totalResults;

      yield put(
        fetchNewsSuccess({
          articles: data.articles,
          hasMore: hasMore,
        })
      );
    } else {
      yield put(fetchNewsFailure(data.message || 'Something went wrong'));
    }
  } catch (error) {
    yield put(fetchNewsFailure(error.message || 'API call failed'));
  }
}

export function* watchNewsSaga() {
  yield takeLatest(fetchNewsRequest.type, fetchNewsWorker);
}
