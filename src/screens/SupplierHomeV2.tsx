import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import useFetch from 'hooks/useFetch';
import {useAppDispatch, useAppSelector} from 'hooks';
import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import DynamicModal from './customer/cart/CustomModal';
import {useQueryClient} from '@tanstack/react-query';
import {FAlert} from 'components';
import {RootState} from 'store';
import {catalogList} from 'store/slices/catalogSlice';

const dummyCategories = [
  {id: '1', name: 'Electronics', image: 'https://via.placeholder.com/100'},
  {id: '2', name: 'Fashion', image: 'https://via.placeholder.com/100'},
  {id: '3', name: 'Home', image: 'https://via.placeholder.com/100'},
  {id: '4', name: 'Beauty', image: 'https://via.placeholder.com/100'},
  {id: '5', name: 'Sports', image: 'https://via.placeholder.com/100'},
  {id: '6', name: 'Books', image: 'https://via.placeholder.com/100'},
];
const truncateText = (text, maxLength) => {
  if (text?.length <= maxLength) return text;
  return `${text?.substring(0, maxLength)}...`;
};

const CategoryItem = ({item}) => (
  <View style={styles.categoryItem}>
    <Image
      source={{uri: item.imageUrl?.[0]?.imageUrl}}
      style={styles.categoryImage}
    />
    <Text style={styles.name}>{truncateText(item?.name || '', 7)}</Text>
  </View>
);

const SupplierHomeV2 = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Pending');
  const dispatch = useAppDispatch();
  const {supplierData} = useAppSelector(state => state.auth);
  const catalogData = useAppSelector((state: RootState) => state.catalog.data);

  useEffect(() => {
    if (supplierData?.id) {
      dispatch(catalogList(supplierData.id));
    }
  }, [supplierData?.id, dispatch]);
  const {
    data: ordersList,
    error,
    isLoading,
  } = useFetch<any[]>(
    ['supplier-cart', supplierData?.id],
    `/suppliers/${supplierData?.id}/carts`,
    false,
  );
  console.log(ordersList, 'oslist');

  const filteredOrders = useMemo(() => {
    return ordersList?.filter(order =>
      activeTab === 'Pending'
        ? order.status === 'PENDING'
        : order.status === 'ACCEPTED',
    );
  }, [ordersList, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#B1DEFF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#B1DEFF"
          />
        </View>
        <View style={styles.divider} />

        {catalogData && catalogData?.length <= 0 && (
          <Pressable
            onPress={() => navigation.navigate('NewCatalogScreen')}
            style={styles.createButton}>
            <View style={styles.leftContent}>
              <View style={styles.plusIconContainer}>
                <Icon name="plus" size={20} color="#007AFF" />
              </View>
              <Text style={styles.buttonText}>Create Catalog</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </Pressable>
        )}

        {catalogData && catalogData?.length > 0 && (
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>Catalog</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CatalogScreen')}>
              <Text style={styles.showAllText}>Show All</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={catalogData?.slice(0, 8)} // Limit to the first 8 items
          renderItem={CategoryItem}
          keyExtractor={item => item.id.toString()}
          numColumns={4}
          columnWrapperStyle={styles.categoryRow}
        />
        <View style={styles.divider} />
        <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
          <Text style={styles.categoriesTitle}>Orders</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Pending' && styles.activeTab]}
            onPress={() => setActiveTab('Pending')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Pending' && styles.activeTabText,
              ]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
            onPress={() => setActiveTab('Ongoing')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Ongoing' && styles.activeTabText,
              ]}>
              Ongoing
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderListContainer}>
          {filteredOrders && filteredOrders.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.orderList}>
              {filteredOrders.map(order => (
                <OrderCard
                  navigation={navigation}
                  key={order.id}
                  order={order}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noOrdersContainer}>
              <Text style={styles.noOrdersText}>
                {activeTab === 'Pending'
                  ? 'No Pending Orders'
                  : 'No Ongoing Orders'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupplierHomeV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    paddingVertical: 0,
  },
  divider: {
    height: 1, // Thickness of the divider
    backgroundColor: '#E6E6E6', // Color of the divider
    marginVertical: 10, // Space around the divider
  },
  orderListContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 600, // Adjust this value as needed
  },
  orderList: {
    paddingTop: 8,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500, // Adjust this value as needed
  },
  noOrdersText: {
    fontSize: 16,
    color: 'gray',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    borderColor: '#B1DEFF',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIconContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  showAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  categoryRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginVertical: 10,
    width: '23%',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryName: {
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,

    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    // Subtle elevation for Android
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2891e0',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: '#2891e0',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,

    // Subtle shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    // Subtle elevation for Android
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderAddress: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 4,
  },
  orderId: {
    fontSize: 14,
    color: 'gray',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#0fc300',
  },
  declineButton: {
    backgroundColor: '#fd0100',
  },
  buttonText2: {
    color: 'white',
    // fontWeight: 'bold',
  },
  statusText: {color: '#0fc300', fontSize: 14},
});

const OrderCard = ({order, navigation}) => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleReject, setModalVisibleReject] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleOkClick = () => {
    setAlertVisible(false);
  };

  const handleCancelClick = () => {
    setAlertVisible(false);
  };
  const {mutate, isLoading} = usePost(`/cart/${order?.id}/acceptCart`, {
    onError: (error, variables, context) => {
      console.error('Error sending request with id', error);
      showToast('Something went wrong. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['supplier-cart']});
      showToast('Approved successfully');
      // setAlertVisible(true);
    },
  });

  const {mutate: rejectCart} = usePost(`/cart/${order?.id}/rejectCart`, {
    onError: (error, variables, context) => {
      console.error('Error sending request with id', error);
      showToast('Something went wrong. Please try again.');
    },
    onSuccess: () => {
      showToast('Cart Rejected successfully');
      queryClient.invalidateQueries({queryKey: ['supplier-cart']});
    },
  });

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SupplierStepper', {order})}
      style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.orderName}>{order?.customer?.fullName}</Text>
        <Text style={styles.orderId}>
          <Text style={styles.orderId}>
            <Text style={{fontWeight: 'bold'}}>Order ID</Text>:{' '}
            {truncateText(order.id, 25)}
          </Text>
        </Text>
        <Text style={styles.orderAddress}>
          <Text style={{fontWeight: 'bold'}}>Delivery Address</Text>:{' '}
          {order.deliveryAddress?.addressLine1},
          {order.deliveryAddress?.addressLine2}
          {order.deliveryAddress?.city}, {order.deliveryAddress?.state},
          {order.deliveryAddress?.country}, {order.deliveryAddress?.postalCode}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={{fontWeight: 'bold'}}>Status: </Text>
        <Text style={styles.statusText}>{order?.status}</Text>
      </View>
      {order?.status === 'PENDING' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.button, styles.acceptButton]}>
            <Text style={styles.buttonText2}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisibleReject(true)}
            style={[styles.button, styles.declineButton]}>
            <Text style={styles.buttonText2}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure you want to approve this cart?"
        onSuccess={mutate}
        successButtonText="Approve"
        cancelButtonText="Cancel"
      />
      <DynamicModal
        modalVisible={modalVisibleReject}
        onRequestClose={() => setModalVisibleReject(false)}
        message="Are you sure you want to reject this cart?"
        onSuccess={rejectCart}
        successButtonText="Reject"
        cancelButtonText="Cancel"
      />
    </TouchableOpacity>
  );
};
