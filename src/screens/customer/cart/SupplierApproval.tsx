import {useAppSelector} from 'hooks';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const SupplierApproval = ({onNext, fromOrders, product}) => {
  const cartItems = useAppSelector(state => state.cart.items);
  const {totalCartQuantity, totalPrice} = useAppSelector(state => state.cart);

  const itemsToDisplay = fromOrders ? product.items : cartItems;
  const totalPriceToDisplay = fromOrders
    ? product.items.reduce(
        (total, item) =>
          total + parseFloat(item.product.unitPrice) * item.quantity,
        0,
      )
    : totalPrice;

  console.log(product?.status, 'pstatus');

  return (
    <View style={styles.stepContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {itemsToDisplay?.map(item => {
            const productData = fromOrders ? item.product : item;
            return (
              <View key={productData.id} style={styles.cartItem}>
                <Image
                  source={{
                    uri:
                      productData.imageUrlList?.[0]?.imageUrl ||
                      'https://via.placeholder.com/100',
                  }}
                  style={styles.image}
                />
                <View style={styles.cartDetails}>
                  <Text style={styles.heading}>{productData.name}</Text>
                  <Text style={styles.subheading}>
                    {productData.description}
                  </Text>
                  <View style={styles.cartPriceRow}>
                    <Text style={styles.price}>₹{productData.unitPrice}</Text>
                    <Text style={styles.discountPrice}>
                      ₹{productData.unitPrice}
                    </Text>
                    <Text style={styles.discountPercentage}>-0%</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <Text>
                      Quantity: {fromOrders ? item.quantity : item.cartQuantity}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          <TouchableOpacity style={[styles.button, styles.addToCartButton]}>
            <Text style={styles.buttonText}>
              {product?.status === 'PENDING' || !product?.status
                ? 'Approval Pending'
                : product?.status === 'ACCEPTED'
                ? 'Request Approved'
                : 'Unknown'}
            </Text>
          </TouchableOpacity>
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailText}>
              Price Details ({itemsToDisplay?.length} Item)
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.orderTotal}>Order Total</Text>
              <Text style={styles.orderTotal}>
                ₹{totalPriceToDisplay.toFixed(2)}
              </Text>
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
              <Text style={styles.orderTotal}>
                ₹{totalPriceToDisplay.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {product?.status === 'ACCEPTED' && (
        <View>
          <TouchableOpacity
            onPress={onNext}
            style={{
              backgroundColor: '#2196f3',
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{color: 'white', fontWeight: 'bold', alignSelf: 'center'}}>
              Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 0,
    width: '100%',
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  addToCartButton: {
    backgroundColor: '#D3E7F6',

    marginRight: 5,
  },
  buyNowButton: {
    backgroundColor: '#2196f3',
    marginLeft: 5,
  },
  buttonText: {
    color: '#262626',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 16,
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
});

export default SupplierApproval;
