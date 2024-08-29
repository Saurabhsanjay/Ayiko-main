import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const {width} = Dimensions.get('window');
const columnWidth = (width - 40) / 3;

const categoryData = [
  {id: '1', name: 'Water & Drinks', image: 'https://via.placeholder.com/60'},
  {id: '2', name: 'Shopping', image: 'https://via.placeholder.com/60'},
  {id: '3', name: 'Travel', image: 'https://via.placeholder.com/60'},
  {id: '4', name: 'Entertainment', image: 'https://via.placeholder.com/60'},
  {id: '5', name: 'Education', image: 'https://via.placeholder.com/60'},
  {id: '6', name: 'Health', image: 'https://via.placeholder.com/60'},
  {id: '7', name: 'Technology', image: 'https://via.placeholder.com/60'},
  {id: '8', name: 'Sports', image: 'https://via.placeholder.com/60'},
  {id: '9', name: 'Finance', image: 'https://via.placeholder.com/60'},
  {id: '1', name: 'Water & Drinks', image: 'https://via.placeholder.com/60'},
  {id: '2', name: 'Shopping', image: 'https://via.placeholder.com/60'},
  {id: '3', name: 'Travel', image: 'https://via.placeholder.com/60'},
  {id: '4', name: 'Entertainment', image: 'https://via.placeholder.com/60'},
  {id: '5', name: 'Education', image: 'https://via.placeholder.com/60'},
  {id: '6', name: 'Health', image: 'https://via.placeholder.com/60'},
  {id: '7', name: 'Technology', image: 'https://via.placeholder.com/60'},
  {id: '8', name: 'Sports', image: 'https://via.placeholder.com/60'},
  {id: '9', name: 'Finance', image: 'https://via.placeholder.com/60'},
  {id: '1', name: 'Water & Drinks', image: 'https://via.placeholder.com/60'},
  {id: '2', name: 'Shopping', image: 'https://via.placeholder.com/60'},
  {id: '3', name: 'Travel', image: 'https://via.placeholder.com/60'},
  {id: '4', name: 'Entertainment', image: 'https://via.placeholder.com/60'},
  {id: '5', name: 'Education', image: 'https://via.placeholder.com/60'},
  {id: '6', name: 'Health', image: 'https://via.placeholder.com/60'},
  {id: '7', name: 'Technology', image: 'https://via.placeholder.com/60'},
  {id: '8', name: 'Sports', image: 'https://via.placeholder.com/60'},
  {id: '9', name: 'Finance', image: 'https://via.placeholder.com/60'},
];

const CategoryItem = ({item}) => (
  <TouchableOpacity style={[styles.categoryItem, {width: columnWidth}]}>
    <View style={styles.imageContainer}>
      <Image source={{uri: item.image}} style={styles.image} />
    </View>
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.categoryName}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const renderItem = ({item, index}) => (
    <View>
      <CategoryItem item={item} index={index} />
      {(index + 1) % 3 === 0 && <View style={styles.rowGap} />}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: '#262626',
    width: '100%',
  },
  rowGap: {
    height: 15,
  },
});
