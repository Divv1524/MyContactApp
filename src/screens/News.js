import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchNewsRequest, loadMoreNews, resetNews, setDateFilter } from '../redux/slice/newsSlices';

const News = () => {
  const dispatch = useDispatch();
  const { articles, loading, error, hasMore, fromDate, toDate } = useSelector(
    (state) => state.news
  );

  const [localFrom, setLocalFrom] = useState(fromDate);
  const [localTo, setLocalTo] = useState(toDate);

  useEffect(() => {
    dispatch(fetchNewsRequest());
  }, [dispatch]);

  const handleOpenURL = (url) => {
    Linking.openURL(url).catch((err) =>
      alert('Failed to open URL: ' + err.message)
    );
  };

  const handleSearch = () => {
    dispatch(resetNews());
    dispatch(setDateFilter({ fromDate: localFrom, toDate: localTo }));
    dispatch(fetchNewsRequest());
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(loadMoreNews());
      dispatch(fetchNewsRequest());
    }
  }, [hasMore, loading, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(resetNews());
    dispatch(setDateFilter({ fromDate: localFrom, toDate: localTo }));
    dispatch(fetchNewsRequest());
  }, [dispatch, localFrom, localTo]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.urlToImage ? (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{moment(item.publishedAt).format('YYYY-MM-DD')}</Text>
      <Text numberOfLines={3}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleOpenURL(item.url)}>
        <Text style={styles.link}>Read Full Article</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && articles.length === 0) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No news articles found</Text>
        <Text style={styles.emptySubText}>Try adjusting your date filters and search again</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Inputs */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="From date (YYYY-MM-DD)"
          value={localFrom}
          onChangeText={setLocalFrom}
        />
        <TextInput
          style={styles.input}
          placeholder="To date (YYYY-MM-DD)"
          value={localTo}
          onChangeText={setLocalTo}
        />
        <Button title="Search News" onPress={handleSearch} disabled={loading} />
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* News List */}
      <FlatList
        data={articles}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={loading && articles.length > 0}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
      />
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f8ff',
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
    height: 40,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  filterContainer: {
    marginBottom: 15,
  },
  link: {
    color: '#007AFF',
    marginTop: 6,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
