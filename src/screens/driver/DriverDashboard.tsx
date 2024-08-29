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
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import useFetch from 'hooks/useFetch';
import {useAppDispatch, useAppSelector} from 'hooks';
import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import DynamicModal from 'screens/customer/cart/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDriverByToken, signOut} from 'store/slices/authSlice';
import {useQueryClient} from '@tanstack/react-query';

const truncateText = (text, maxLength) => {
  if (text?.length <= maxLength) return text;
  return `${text?.substring(0, maxLength)}...`;
};

const DriverDashboard = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Assigned');
  const dispatch = useAppDispatch();
  const logoutFunction = useCallback(async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem(
      'showSplash',
      JSON.stringify({showSplash: true}),
    );
    navigation.navigate('Welcome');
    dispatch(signOut());
  }, [dispatch, navigation]);
  const {driverData} = useAppSelector(state => state.auth);
  console.log(driverData, 'drver');
  const {
    data: ordersList,
    error,
    isLoading,
  } = useFetch<any[]>(['driver-cart'], 'orders/driver', false);
  const queryClient = useQueryClient();
  useEffect(() => {
    dispatch(getDriverByToken());
    queryClient.invalidateQueries({queryKey: ['driver-cart']});
  }, []);

  const filteredOrders = ordersList?.filter(order =>
    activeTab === 'Assigned'
      ? order.driverStatus === 'DRIVER_ASSIGNED' ||
        order?.driverStatus === 'DRIVER_ACCEPTED'
      : order.driverStatus === 'DELIVERY_COMPLETED',
  );

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('DriverProfile')}
        style={styles.userInfoContainer}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/50' || driverData?.profileImage,
          }} // Replace with your image URL
          style={styles.image}
        />
        <Text style={styles.userName}>Hello, {driverData?.name}</Text>
        <TouchableOpacity onPress={() => logoutFunction()}>
          <Text style={styles.userName}> Logout</Text>
        </TouchableOpacity>
      </Pressable>
      <ScrollView>
        <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
          <Text style={styles.categoriesTitle}>Orders</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('Assigned')}
            style={[styles.tab, activeTab === 'Assigned' && styles.activeTab]}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Assigned' && styles.activeTabText,
              ]}>
              Assigned
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
            onPress={() => setActiveTab('Completed')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Completed' && styles.activeTabText,
              ]}>
              Completed
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
                {activeTab === 'Assigned'
                  ? 'No Assigned Orders'
                  : 'No Completed Orders'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    paddingVertical: 0,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 10,
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  userName: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
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
    minHeight: 550, // Adjust this value as needed
    marginBottom: 10,
  },
  orderList: {
    paddingTop: 8,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Adjust this value as needed
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
    justifyContent: 'space-around',
  },
  categoryItem: {
    alignItems: 'center',
    margin: 10,
    width: '33%',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  categoryName: {
    marginTop: 5,
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
    marginTop: 8,
  },
  orderId: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
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
  buttonContainerAccepted: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonO: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    // marginLeft: 10,
  },
  OngoingButton: {
    backgroundColor: '#c2e6ff',
    color: '#6f787c',
  },
  markAsDelivered: {
    backgroundColor: '#44aafc',
  },
  buttonongoing: {color: '#6f787c', fontWeight: 'bold'},
  buttonText2: {
    color: 'white',
    // fontWeight: 'bold',
    fontWeight: 'bold',
  },
  statusText: {color: '#0fc300', fontSize: 14},
});

const OrderCard = ({order, navigation}) => {
  const {showToast} = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleReject, setModalVisibleReject] = useState(false);
  const [modalVisiblDeliver, setModalVisibleDeliver] = useState(false);
  const queryClient = useQueryClient();
  const {mutate, isLoading} = usePost(`/orders/${order?.id}/driverAccepted`, {
    onError: (error, variables, context) => {
      console.error('Error sending request with id', error);
      showToast('Something went wrong. Please try again.');
    },
    onSuccess: () => {
      showToast('Approved successfully');
      queryClient.invalidateQueries({queryKey: ['driver-cart']});
    },
  });

  const {mutate: rejectCart} = usePost(`/orders/${order?.id}/driverRejected`, {
    onError: (error, variables, context) => {
      console.error('Error sending request with id', error);
      showToast('Something went wrong. Please try again.');
    },
    onSuccess: () => {
      showToast('Cart Rejected successfully');
    },
  });

  const {mutate: markAsDeilver} = usePost(
    `/orders/${order?.id}/completeDelivery`,
    {
      onError: (error, variables, context) => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        showToast('Cart Rejected successfully');
      },
    },
  );
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DriverDeliveryDetailScreen', {order})}
      style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.orderName}>{order?.customer?.fullName}</Text>
        <Text style={styles.orderId}>
          <Text style={styles.orderId}>
            <Text style={{fontWeight: 'bold'}}>
              {' '}
              <Icon name="align-justify" size={15} /> Order ID
            </Text>
            : {truncateText(order.id, 25)}
          </Text>
        </Text>
        <Text style={styles.orderAddress}>
          <Text style={{fontWeight: 'bold'}}>
            <Icon name="map-pin" size={15} /> Delivery Address
          </Text>
          : {order.deliveryAddress?.addressLine1},
          {order.deliveryAddress?.addressLine2}
          {order.deliveryAddress?.city}, {order.deliveryAddress?.state},
          {order.deliveryAddress?.country}, {order.deliveryAddress?.postalCode}
        </Text>
      </View>
      {/* <View style={styles.statusContainer}>
        <Text style={{fontWeight: 'bold'}}>Status: </Text>
        <Text style={styles.statusText}>{order?.status}</Text>
      </View> */}
      {order?.driverStatus === 'DRIVER_ASSIGNED' && (
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
      {order?.driverStatus === 'DRIVER_ACCEPTED' && (
        <View style={styles.buttonContainerAccepted}>
          <TouchableOpacity style={[styles.buttonO, styles.OngoingButton]}>
            <Text style={styles.buttonongoing}>Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisibleDeliver(true)}
            style={[styles.buttonO, styles.markAsDelivered]}>
            <Text style={styles.buttonText2}>Mark as Delivered</Text>
          </TouchableOpacity>
        </View>
      )}
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure do you want to accept this order?"
        onSuccess={mutate}
        successButtonText="Approve"
        cancelButtonText="Cancel"
      />
      <DynamicModal
        modalVisible={modalVisibleReject}
        onRequestClose={() => setModalVisibleReject(false)}
        message="Are you sure do you want to reject this order?"
        onSuccess={rejectCart}
        successButtonText="Reject"
        cancelButtonText="Cancel"
      />
      <DynamicModal
        modalVisible={modalVisiblDeliver}
        onRequestClose={() => setModalVisibleDeliver(false)}
        message="Mark as Delivered ?"
        onSuccess={markAsDeilver}
        successButtonText="Confirm"
        cancelButtonText="Cancel"
      />
    </TouchableOpacity>
  );
};
