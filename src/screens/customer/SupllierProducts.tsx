/* eslint-disable react/no-unstable-nested-components */
import {useToast} from 'contexts/ToastContext';
import {useAppDispatch, useAppSelector} from 'hooks';
import useFetch from 'hooks/useFetch';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  addItemAsync,
  clearCart,
  clearDifferentSupplierError,
} from 'store/slices/CartSlice';
import {Products, SupplierDetails} from 'types/supplier';
import CustomAlert from './CustomAlert';

const ProductCard = ({item, navigation, showDifferentSupplierPopup}) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
  const {showToast} = useToast();

  const handleAddToCart = () => {
    if (!existingItem) {
      dispatch(addItemAsync({...item, cartQuantity: 1}))
        .unwrap()
        .then(() => {
          showToast('Item added to cart');
        })
        .catch(error => {
          if (error.type === 'DIFFERENT_SUPPLIER') {
            showDifferentSupplierPopup(error.message, item.id);
          } else {
            console.error(error, 'Error adding item to cart');
            showToast('Failed to add item to cart');
          }
        });
    } else {
      console.log('Item already in cart');
    }
  };
  function truncate(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetails', {
          productId: item.id,
        })
      }
      style={styles.productCard}>
      <Image
        source={{
          uri:
            item?.imageUrl?.[0]?.imageUrl ||
            'https://via.placeholder.com/400x200',
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.productTitle}>{truncate(item?.name, 9)}</Text>
          {existingItem ? (
            <TouchableOpacity
              style={styles.removebutton}
              onPress={handleAddToCart}>
              <Text style={styles.removeButtonText}>Added to cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Add to cart</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.productPrice}>$ {item.unitPrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SupplierProducts = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] =
    useState(false);
  const [sortOption, setSortOption] = useState('');
  const [availabilityOption, setAvailabilityOption] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const {supplierId, supplierName} = route.params;

  const differentSupplierError = useAppSelector(
    state => state.cart.differentSupplierError,
  );

  const availabilityOptions = ['In Stock Items', 'Out of Stock Items'];
  const sortOptions = [
    'New Arrivals',
    'Price (High to Low)',
    'Price (Low to High)',
  ];

  const {
    data: productsList,
    error,
    isLoading,
  } = useFetch<Products[]>(
    ['supplierproducts', supplierId],
    `/suppliers/${supplierId}/products`,
  );
  console.log(productsList, 'pk');
  const {data: supplierDetails} = useFetch<SupplierDetails[]>(
    ['supplier-details', supplierId],
    `/suppliers/${supplierId}`,
  );

  const showDifferentSupplierPopup = (message: string, itemId: string) => {
    setAlertMessage(message);
    setSelectedItemId(itemId);
    setAlertVisible(true);
  };

  const handleYes = () => {
    const item = productsList.find(item => item.id === selectedItemId);
    if (item) {
      dispatch(clearCart());
      dispatch(addItemAsync({...item, cartQuantity: 1}));
    }
    dispatch(clearDifferentSupplierError());
    setAlertVisible(false);
  };

  const handleNo = () => {
    dispatch(clearDifferentSupplierError());
    setAlertVisible(false);
  };

  useEffect(() => {
    if (differentSupplierError) {
      showDifferentSupplierPopup(differentSupplierError, '');
    }
  }, [differentSupplierError]);

  const renderSortModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Sort</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name={'x'} size={20} color="black" />
            </TouchableOpacity>
          </View>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioButton}
              onPress={() => setSortOption(option)}>
              <Icon
                name={sortOption === option ? 'check-circle' : 'circle'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const AvailabilityModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={availabilityModalVisible}
      onRequestClose={() => setAvailabilityModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Availability</Text>
            <TouchableOpacity
              onPress={() => setAvailabilityModalVisible(false)}>
              <Icon name={'x'} size={20} color="black" />
            </TouchableOpacity>
          </View>
          {availabilityOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioButton}
              onPress={() => setAvailabilityOption(option)}>
              <Icon
                name={availabilityOption === option ? 'check-circle' : 'circle'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setAvailabilityModalVisible(false)}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri:
            supplierDetails?.images?.[0]?.imageUrl ||
            'https://via.placeholder.com/400x200',
        }}
        style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Image
            source={{
              uri:
                supplierDetails?.images?.[0]?.imageUrl ||
                'https://via.placeholder.com/100',
            }}
            style={styles.logo}
          />
        </View>
      </ImageBackground>
      <Text style={styles.heading}>{supplierName}</Text>
      <View style={styles.ratingContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.ratingChip}>
            <Text style={styles.ratingText}>3.3 ★</Text>
          </View>
          <Text style={styles.ratingCount}>
            {supplierDetails?.rating} ratings
          </Text>
        </View>
        <View>
          <Text style={styles.productCount}>
            {supplierDetails?.productCount}
          </Text>
          <Text style={styles.productCount}>Products</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        {['Sort', 'Category', 'Price', 'Availability'].map((item, index) => (
          <React.Fragment key={item}>
            {index !== 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (item === 'Sort') {
                  setModalVisible(true);
                } else if (item === 'Availability') {
                  setAvailabilityModalVisible(true);
                }
              }}>
              <Text style={styles.menuText}>{item}</Text>
              <Icon name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      {productsList && productsList?.length > 0 ? (
        <FlatList
          data={productsList}
          renderItem={({item}) => (
            <ProductCard
              item={item}
              navigation={navigation}
              showDifferentSupplierPopup={showDifferentSupplierPopup}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
        />
      ) : (
        <View style={styles.centeredView}>
          <Text style={styles.noDataText}>No products available</Text>
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onYes={handleYes}
        onNo={handleNo}
      />

      {renderSortModal()}
      {AvailabilityModal()}
    </View>
  );
};

export default SupplierProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: 150,
    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
  },
  overlay: {
    alignItems: 'center',
    position: 'relative',
    height: 50,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    bottom: -50,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
  },
  ratingContainer: {
    flexDirection: 'row',
    rowGap: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  ratingChip: {
    borderWidth: 1,
    borderColor: '#4cb4ff',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  ratingText: {
    color: '#4cb4ff',
    fontWeight: 'bold',
  },
  ratingCount: {
    marginTop: 5,
    color: '#666',
  },
  productCount: {
    color: '#000',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    paddingVertical: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginRight: 5,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  productCard: {
    marginTop: 20,
    width: '49%',
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#6b7280',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 5,
  },
  removebutton: {
    borderWidth: 1,
    borderColor: '#4485f5',
    paddingHorizontal: 8,
    backgroundColor: '#4485f5',

    paddingVertical: 1,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#6b7280',
    fontSize: 11,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 11,
  },
  productPrice: {
    fontSize: 14,
    color: '#262626',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
