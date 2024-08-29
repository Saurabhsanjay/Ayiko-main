import {useNavigation, useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductCard = ({product}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProductDetails')}>
      <View style={styles.card}>
        <Image source={{uri: product.image}} style={styles.image} />
        <View style={styles.info}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            {product.title}
          </Text>
          <Text style={styles.company}>{product.company}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Icon name="star" size={16} color="#4cb4ff" />
          </View>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Icon name="cart" size={16} color="white" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 7,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 100,
    height: '100%',
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    borderWidth: 1,

    borderRadius: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 3,
  },
  company: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4cb4ff',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#4cb4ff',
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#4cb4ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    gap: 3,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProductCard;
