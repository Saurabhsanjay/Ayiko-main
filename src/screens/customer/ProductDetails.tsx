import {useAppDispatch, useAppSelector} from 'hooks';
import useFetch from 'hooks/useFetch';
import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  addItem,
  addItemAsync,
  CartItem,
  clearCart,
  clearDifferentSupplierError,
  removeItem,
  updateCartQuantity,
  updateQuantity,
} from 'store/slices/CartSlice';
import {TProductDetails} from 'types/product';
import CartModal from './cart/ErrorModal';
import {useToast} from 'contexts/ToastContext';
import CustomAlert from './CustomAlert';

const {width} = Dimensions.get('window');
const height = 300;

const ProductDetails = ({navigation, route}: any) => {
  const {productId} = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState('Econ Supplier');
  const [newSupplier, setNewSupplier] = useState('MBH');

  const cartItems = useAppSelector(state => state.cart.items);
  const error = useAppSelector(state => state.cart.error);
  const existingItem = cartItems.find(item => item.id === productId);
  const differentSupplierError = useAppSelector(
    state => state.cart.differentSupplierError,
  );
  console.log(error, 'tc');
  console.log(cartItems, 'citems');
  const [active, setActive] = useState(0);
  const scrollViewRef = useRef<any>(null);

  const {
    data: singleProduct,
    // error,
    isLoading,
  } = useFetch<TProductDetails>(
    ['product-details', productId],
    `/products/${productId}`,
  );
  console.log(singleProduct, 'spppp');
  const images = [
    'https://via.placeholder.com/400x300/333333/FFFFFF?text=Image+1',
    'https://via.placeholder.com/400x300/666666/FFFFFF?text=Image+2',
    'https://via.placeholder.com/400x300/999999/FFFFFF?text=Image+3',
  ];

  useEffect(() => {
    // Check if singleProduct and imageUrlList are defined
    if (singleProduct?.imageUrlList?.length) {
      const interval = setInterval(() => {
        if (active === singleProduct.imageUrlList.length - 1) {
          scrollViewRef.current.scrollTo({x: 0, animated: true});
        } else {
          scrollViewRef.current.scrollTo({
            x: (active + 1) * width,
            animated: true,
          });
        }
      }, 3000);

      // Clean up the interval on component unmount or when dependencies change
      return () => clearInterval(interval);
    }
  }, [active, singleProduct]);

  const change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };
  const decreaseCartQuantity = () => {
    if (existingItem && existingItem.cartQuantity > 1) {
      dispatch(
        updateCartQuantity({
          id: productId,
          cartQuantity: existingItem.cartQuantity - 1,
        }),
      );
    }
  };

  const increaseCartQuantity = () => {
    if (error) {
      setModalVisible(true);
    }
    if (existingItem) {
      dispatch(
        updateCartQuantity({
          id: productId,
          cartQuantity: existingItem.cartQuantity + 1,
        }),
      );
    } else {
      dispatch(
        addItem({...singleProduct, cartQuantity: 1} as unknown as CartItem),
      );
    }
  };

  const {showToast} = useToast();
  const handleAddToCart = () => {
    if (!existingItem) {
      dispatch(addItemAsync({...singleProduct, cartQuantity: 1} as CartItem))
        .unwrap()
        .then(() => {
          showToast('Item added to cart');
        })
        .catch(error => {
          if (error.type === 'DIFFERENT_SUPPLIER') {
            showDifferentSupplierPopup(error.message);
          } else {
            console.error(error, 'Error adding item to cart');
            setModalVisible(true);
          }
        });
    } else {
      console.log('Item already in cart');
      // item is already in the cart
    }
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showDifferentSupplierPopup = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(addItemAsync({...singleProduct, cartQuantity: 1} as CartItem));
    dispatch(clearDifferentSupplierError());
    setAlertVisible(false);
  };

  const handleNo = () => {
    dispatch(clearDifferentSupplierError());
    setAlertVisible(false);
  };

  // Handle differentSupplierError
  React.useEffect(() => {
    if (differentSupplierError) {
      showDifferentSupplierPopup(differentSupplierError);
    }
  }, [differentSupplierError]);

  const handleRemoveFromCart = () => {
    dispatch(removeItem(productId));
  };

  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    dispatch(clearCart());
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Toast /> */}
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onYes={handleYes}
        onNo={handleNo}
      />
      <ScrollView>
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={change}
            ref={scrollViewRef}
            style={styles.carousel}>
            {singleProduct?.imageUrlList.map((image, index) => (
              <Image
                key={index}
                source={{uri: image}}
                style={styles.carouselImage}
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {singleProduct?.imageUrlList.map((i, k) => (
              <View
                key={k}
                style={k === active ? styles.activeIndicator : styles.indicator}
              />
            ))}
          </View>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.heading}>{singleProduct?.name}</Text>
            <Text
              style={styles.subheading}
              numberOfLines={2}
              ellipsizeMode="tail">
              {singleProduct?.description}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareIcon}>
            <Icon name="share-social-outline" size={24} color="#000" />
            <Text style={styles.subheading}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{singleProduct?.unitPrice}</Text>
          <Text style={styles.offPrice}>₹{singleProduct?.unitPrice}</Text>
          <Text style={styles.discount}>{singleProduct?.unitPrice}%</Text>
        </View>

        <View style={styles.divider} />
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Add Quantity </Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={decreaseCartQuantity}
              style={styles.quantityButton}>
              <Icon name="remove" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityCount}>
              {existingItem ? existingItem.cartQuantity : 0}
            </Text>
            <TouchableOpacity
              onPress={increaseCartQuantity}
              style={styles.quantityButton}>
              <Icon name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Product Details</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailItem}>Name: Product Name</Text>
          <Text style={styles.detailItem}>Material: Product Material</Text>
          <Text style={styles.detailItem}>Pattern: Product Pattern</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {existingItem ? (
          <>
            <TouchableOpacity
              onPress={handleRemoveFromCart}
              style={[styles.button, styles.removeFromCartButton]}>
              <Text style={styles.buttonText}>Remove from Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Stepper')}
              style={[styles.button, styles.addToCartButton]}>
              <Text style={styles.buttonText}>Go to Cart</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleAddToCart}
              style={[styles.button, styles.addToCartButton]}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buyNowButton]}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <CartModal
        isVisible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        currentSupplier={currentSupplier}
        newSupplier={newSupplier}
      />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height,
  },
  carousel: {
    width,
    height,
  },
  carouselImage: {
    width,
    height,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  indicator: {
    width: 20,
    height: 3,
    backgroundColor: '#888',
    marginHorizontal: 3,
  },
  activeIndicator: {
    width: 20,
    height: 3,
    backgroundColor: '#FFF',
    marginHorizontal: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: 'green',
  },
  titleContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 14,
    color: '#666',
  },
  shareIcon: {
    padding: 8,
    alignSelf: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#c2e6ff',
    marginLeft: 10,
  },
  quantityButton: {
    padding: 2,
  },
  quantityCount: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  offPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#666',
    marginRight: 10,
  },
  discount: {
    fontSize: 16,
    color: 'green',
  },
  divider: {
    height: 8,
    backgroundColor: '#c2e6ff',
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: '#2196f3',
    marginRight: 5,
  },
  removeFromCartButton: {
    backgroundColor: '#ef4444',
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
});
