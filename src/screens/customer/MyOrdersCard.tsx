import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MyOrdersCard = ({product, isLoading}) => {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4cb4ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        navigation.navigate('Stepper', {product, fromOrders: true})
      }>
      <View style={styles.card}>
        <Image
          source={{uri: product.image || 'https://via.placeholder.com/150x150'}}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            {product?.items?.[0]?.product?.name}
          </Text>
          <Text style={styles.company}>
            {product?.items?.[0]?.product?.category}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{0}</Text>
            <Icon name="star" size={16} color="#4cb4ff" />
          </View>
          <Text style={styles.price}>
            $ {product?.items?.[0]?.product?.unitPrice}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>{product?.status}</Text>
          </TouchableOpacity>
        </View>
        <Icon
          name="chevron-forward"
          size={24}
          color="#888"
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: '100%',
    borderRadius: 5,
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
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    gap: 3,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  icon: {
    marginLeft: 10,
  },
});

export default MyOrdersCard;
