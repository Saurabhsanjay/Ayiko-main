import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from 'hooks';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {removeItem, updateCartQuantity} from 'store/slices/CartSlice';

const CartStep = ({onNext}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const cartItems = useAppSelector(state => state.cart.items);
  const {totalCartQuantity, totalPrice} = useAppSelector(state => state.cart);

  console.log(totalPrice, 'tq');

  const handleDelete = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleShopNow = () => {
    navigation.navigate('Home');
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    dispatch(updateCartQuantity({id, cartQuantity: currentQuantity + 1}));
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateCartQuantity({id, cartQuantity: currentQuantity - 1}));
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items in your cart</Text>
        <TouchableOpacity style={styles.shopButton} onPress={handleShopNow}>
          <Text style={styles.shopButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.stepContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {cartItems?.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <Image
                source={{
                  uri:
                    item.imageUrlList && item.imageUrlList.length > 0
                      ? item.imageUrlList[0]
                      : 'https://via.placeholder.com/100',
                }}
                style={styles.image}
              />
              <View style={styles.cartDetails}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteIcon}>
                  <Icon name="trash-2" size={20} color="red" />
                </TouchableOpacity>
                <Text style={styles.heading}>{item.name}</Text>
                <Text style={styles.subheading}>{item.description}</Text>
                <View style={styles.cartPriceRow}>
                  <Text style={styles.price}>₹{item.unitPrice}</Text>
                  <Text style={styles.discountPrice}>₹{item.unitPrice}</Text>
                  <Text style={styles.discountPercentage}>-0%</Text>
                </View>
                <View style={styles.quantityContainer}>
                  {/* <Text>Quantity: {item.cartQuantity}</Text> */}
                  <View style={styles.chipContainer}>
                    <TouchableOpacity
                      style={styles.chip}
                      onPress={() =>
                        handleDecreaseQuantity(item.id, item.cartQuantity)
                      }>
                      <Text style={styles.chipText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.cartQuantity}</Text>
                    <TouchableOpacity
                      style={styles.chip}
                      onPress={() =>
                        handleIncreaseQuantity(item.id, item.cartQuantity)
                      }>
                      <Text style={styles.chipText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailText}>
              Price Details ({cartItems?.length} Item)
            </Text>
            <View style={styles.priceRow}>
              <Text>Total Product Price</Text>
              <Text style={styles.price}>+ ₹{totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text>Total Discounts</Text>
              <Text style={styles.discountPrice}>- ₹0</Text>
            </View>
            <View style={styles.priceRow}>
              <Text>Tax & Other Fee</Text>
              <Text style={{marginRight: 3}}>₹0</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.orderTotal}>Order Total</Text>
              <Text style={styles.orderTotal}>₹{totalPrice}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={[styles.button, styles.addToCartButton]}>
            <Text style={styles.buttonText}>Add More Items</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Clicking on 'Continue' will not deduct any money
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>
            <Text style={[styles.orderTotal, {alignSelf: 'center'}]}>
              Pay ₹{totalPrice}
            </Text>
          </Text>
          <TouchableOpacity onPress={onNext} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#2196f3',
    marginRight: 5,
  },
  buyNowButton: {
    backgroundColor: '#2196f3',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  cartDetails: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  quantityContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  chipContainer: {
    backgroundColor: '#dddddd',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  chip: {
    borderWidth: 1,
    backgroundColor: '#dcdcdc',
    borderColor: '#dcdcdc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 20,
  },
  quantity: {
    marginHorizontal: 5,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  priceDetails: {
    borderTopWidth: 8,
    borderTopColor: '#c2e6ff',
    paddingTop: 10,
  },
  priceDetailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 3,
  },
  cartPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  price: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 5,
    marginBottom: 3,
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5,
    marginBottom: 3,
  },
  discountPercentage: {
    fontSize: 12,
    color: 'green',
    marginRight: 5,
    marginBottom: 3,
  },
  footer: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  continueButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 5,
    backgroundColor: '#c2e6ff',
    marginBottom: 10,
    marginTop: 10,
  },
  infoText: {
    alignSelf: 'center',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartStep;
