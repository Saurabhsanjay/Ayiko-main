import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import ProductCard from './ProductCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';

const Search = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimerRef = useRef(null);

  const handleSearch = async query => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `http://13.233.110.164:8090/api/v1/suppliers/search?searchQuery=${encodeURIComponent(
          query,
        )}`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
          },
        },
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(query => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (query) handleSearch(query);
      else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSearch(searchText);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText, debouncedSearch]);

  const handleTextChange = text => {
    setSearchText(text);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#4cb4ff" />;
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {searchResults.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.searchContainer}>
        <Icon name="search" size={24} color="#4cb4ff" style={styles.icon} />
        <TextInput
          autoFocus
          style={styles.input}
          placeholder="Search by item or Supplier..."
          placeholderTextColor="#4cb4ff"
          onChangeText={handleTextChange}
          value={searchText}
        />
      </TouchableOpacity>
      {renderContent()}
    </SafeAreaView>
  );
};

const Styles = ({colors, fonts}) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4cb4ff',
      borderRadius: 20,
      paddingHorizontal: 10,
      marginTop: 0,
      marginBottom: 10,
      marginHorizontal: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 4,
      fontSize: 15,
      color: '#000',
    },
    icon: {
      marginRight: 10,
      color: '#4cb4ff',
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noResultsText: {
      fontSize: 16,
      color: '#888',
    },
  });

export default Search;
 