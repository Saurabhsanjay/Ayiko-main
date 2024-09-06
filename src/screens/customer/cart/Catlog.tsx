import {useNavigation} from '@react-navigation/native';
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
  Pressable,
} from 'react-native';

const {width} = Dimensions.get('window');
const columnWidth = 110;

const categoryData = [
  {
    id: '1',
    name: 'Water and drinks',
    image: 'https://via.placeholder.com/200?text=',
  },
  {
    id: '2',
    name: 'Bars and restaurants',
    image: 'https://via.placeholder.com/200?text=',
  },
  {
    id: '3',
    name: 'Fish and frozen foods',
    image: 'https://via.placeholder.com/200?text=',
  },
  {
    id: '4',
    name: 'Butchers and delicatessens',
    image: 'https://via.placeholder.com/200?text=',
  },
  // Add more categories as needed...
];

const CategoryItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetails', {productId: item?.id})
      }
      style={styles.categoryItem}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.image || 'https://via.placeholder.com/200?text='}}
          style={styles.image}
        />
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.categoryName}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const Catalog = ({catlogData}) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const renderItem = ({item}) => <CategoryItem item={item} />;

  const ItemSeparator = () => <View style={styles.itemSeparator} />; // Adjusted horizontal spacing between items

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.divider}></View>
      <View style={styles.heading}>
        <Text style={styles.catlog}>Catlog</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('SupplierProduct', {
              supplierId: catlogData?.[0]?.supplierDTO?.id,
              supplierName: catlogData?.[0]?.supplierDTO?.companyName,
            })
          }>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      <FlatList
        data={catlogData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator} // Add separator between items
        contentContainerStyle={styles.flatListContent} // Style the content container
      />
    </View>
  );
};

export default Catalog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    // Container background color
  },
  catlog: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black', // Text color black
    padding: 5,
  },
  viewAll: {fontSize: 13},
  heading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  divider: {
    backgroundColor: '#EAF6FF',
    height: 5,
    marginVertical: 10,
  },
  flatListContent: {
    alignItems: 'center',
    paddingHorizontal: 0, // Remove extra padding at the start and end
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    width: columnWidth,
    alignItems: 'center',
    backgroundColor: 'transparent', // Transparent background for the text container
    marginRight: 5, // Adjust margin for spacing
  },
  imageContainer: {
    width: 100, // Width of the image
    height: 100, // Height of the image

    overflow: 'hidden',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black', // Text color black
    padding: 5,
  },
  itemSeparator: {
    width: 5, // Horizontal spacing between items
  },
});
