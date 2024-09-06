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
const numColumns = 3;
const itemSpacing = 10;
const columnWidth = (width - itemSpacing * (numColumns - 1)) / numColumns;

export const categoryData = [
  {
    id: '1',
    name: 'Water and drinks',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
  },
  {
    id: '2',
    name: 'Bars and restaurants',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9',
  },
  {
    id: '3',
    name: 'Fish and frozen foods',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeBTatywvmHTKyGzjGJTVsV42TgaLPkMsnqQ&s',
  },
  {
    id: '4',
    name: 'Butchers and delicatessens',
    image:
      'https://c8.alamy.com/comp/2AJTK84/inside-view-of-rome-store-lantica-salumeria-grocery-store-butcher-shop-deli-at-piazza-della-rotonda-rome-italy-2AJTK84.jpg',
  },
  {
    id: '5',
    name: 'Gas and household appliances',
    image:
      'https://img.canarymedia.com/content/uploads/electric-cooking-1-1.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=501&q=80&w=864&s=c26f751f4aa3d1edfa4ea927042c2e97',
  },
  {
    id: '6',
    name: 'IT and consumables',
    image:
      'https://5.imimg.com/data5/WL/UH/GLADMIN-27124426/it-hardware-and-consumables.png',
  },
  {
    id: '7',
    name: 'Telephony and accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: '8',
    name: 'Automobiles and parts',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  },
  {
    id: '9',
    name: 'Ready-to-wear and accessories',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ClothingReadyWear.jpg/640px-ClothingReadyWear.jpg',
  },
  {
    id: '10',
    name: 'Hardware and cement',
    image:
      'https://thumbs.dreamstime.com/b/cement-department-construction-materials-store-19803392.jpg',
  },
  {
    id: '11',
    name: 'Cafeteria and pastries',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/man-dispensing-cakes-in-a-pastry-bakery-royalty-free-image-1676319170.jpg',
  },
  {
    id: '12',
    name: 'Beauty, cosmetics and care',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702',
  },
  {
    id: '13',
    name: 'Fashion and jewelry',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  },
  {
    id: '14',
    name: 'General living and nutrition',
    image:
      'https://domf5oio6qrcr.cloudfront.net/medialibrary/13503/bigstock-Health-food-selection-super-foods-fruits-veggies.jpg',
  },
  {
    id: '15',
    name: 'Fruits and vegetables',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbnL5g_oquV-oRvYkWogl-VyBO2ya3VCkRUA&s',
  },
];

const CategoryItem = ({item}) => (
  <TouchableOpacity style={[styles.categoryItem, {width: columnWidth}]}>
    <View style={styles.imageContainer}>
      <Image source={{uri: item.image}} style={styles.image} />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
);

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const renderItem = ({item}) => <CategoryItem item={item} />;

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4585ef" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: itemSpacing,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    minHeight: 30,
  },
});

export default Categories;
