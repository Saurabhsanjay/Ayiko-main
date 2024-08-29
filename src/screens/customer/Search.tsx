import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ProductCard from './ProductCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';

const dummyProducts = [
  {
    image: 'https://via.placeholder.com/100',
    title:
      'Diming hallkow REcharable led lamps 3 colors red green blue white balck',
    company: 'Company 1',
    rating: 4,
    price: 29.99,
  },
  {
    image: 'https://via.placeholder.com/100',
    title:
      'Diming hallkow REcharable led lamps 3 colors red green blue white balck',
    company: 'Company 1',
    rating: 4,
    price: 29.99,
  },
  {
    image: 'https://via.placeholder.com/100',
    title:
      'Diming hallkow REcharable led lamps 3 colors red green blue white balck',
    company: 'Company 1',
    rating: 4,
    price: 29.99,
  },
  {
    image: 'https://via.placeholder.com/100',
    title:
      'Diming hallkow REcharable led lamps 3 colors red green blue white balck',
    company: 'Company 1',
    rating: 4,
    price: 29.99,
  },
  {
    image: 'https://via.placeholder.com/100',
    title: 'Product 5',
    company: 'Company 5',
    rating: 4,
    price: 39.99,
  },
];

const Search = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <SafeAreaView>
      <TouchableOpacity style={styles.searchContainer}>
        <Icon name="search" size={24} color="black" style={styles.icon} />
        <TextInput
          autoFocus
          style={styles.input}
          placeholder="Search by item or Supplier..."
          placeholderTextColor="#4cb4ff"

          // onChangeText={setSearchText}
          // value={searchText}
        />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        {dummyProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: '#fff',
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
  });

export default Search;
