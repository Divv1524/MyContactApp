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
  TextInput,
  RefreshControl,
  StatusBar,
  Platform,
  Alert, Button
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { fetchNewsRequest, loadMoreNews, resetNews, setDateFilter } from '../redux/slice/newsSlices';
import AppButton from '../components/AppButton';

const News = () => {
  const dispatch = useDispatch();
  const { articles, loading, error, hasMore, fromDate, toDate } = useSelector((state) => state.news);

  const [localFrom, setLocalFrom] = useState(fromDate);
  const [localTo, setLocalTo] = useState(toDate);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);


  useEffect(() => {
    dispatch(fetchNewsRequest());
  }, [dispatch]);

  const handleOpenURL = (url) => {
    Linking.openURL(url).catch((err) => alert('Failed to open URL: ' + err.message));
  };

  const handleSearch = () => {
    if (!localFrom || !localTo) {
      Alert.alert('Error', 'Please select both From and To dates.');
      return;
    }
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
      {item.urlToImage && <Image source={{ uri: item.urlToImage }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{moment(item.publishedAt).format('YYYY-MM-DD')}</Text>
      <Text numberOfLines={3} style={styles.description}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleOpenURL(item.url)}>
        <Text style={styles.link}>Read Full Article</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => loading && (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color="#007AFF" />
    </View>
  );

  const renderEmpty = () => !loading && articles.length === 0 && (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No news articles found</Text>
      <Text style={styles.emptySubText}>Try adjusting your date filters and search again</Text>
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.container}>
        {/* Heading */}
        <Text style={styles.heading}>News</Text>

        {/* Filter Inputs */}
        <View style={styles.filterContainer}>

          {/* Date Filters */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {localFrom ? `From: ${localFrom}` : 'Select From Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {localTo ? `To: ${localTo}` : 'Select To Date'}
            </Text>
          </TouchableOpacity>


          {showFromPicker && (
            <DateTimePicker
              value={localFrom ? new Date(localFrom) : new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowFromPicker(false);
                if (selectedDate) {
                  const formatted = moment(selectedDate).format('YYYY-MM-DD');
                  const cutoff = new Date('2025-07-21');
                  if (selectedDate < cutoff) {
                    Alert.alert('Invalid Date', 'Please select a date after July 20, 2025.');
                  } else {
                    setLocalFrom(formatted);
                    if (localTo && new Date(localTo) < selectedDate) setLocalTo(null);
                  }
                }
              }}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={localTo ? new Date(localTo) : new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              minimumDate={localFrom ? new Date(localFrom) : undefined}
              onChange={(event, selectedDate) => {
                setShowToPicker(false);
                if (selectedDate) {
                  const formatted = moment(selectedDate).format('YYYY-MM-DD');
                  setLocalTo(formatted);

                }
              }}
            />
          )}
          <AppButton title='Search News'
            onPress={handleSearch}
            disabled={loading}
          />
        </View>

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

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
    </>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  dateButton: {
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  dateButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  description: {
    color: '#555',
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 5,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
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
