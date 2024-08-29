import {useQueryClient} from '@tanstack/react-query';
import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this package
import DynamicModal from 'screens/customer/cart/CustomModal';
import OtpModal from './OtpScreen';

const OrderCard = ({order, navigation, data}) => (
  <View style={styles.orderCard}>
    <Image
      source={{uri: order?.product?.imageUrl?.[0]?.imageUrl}}
      style={styles.productImage}
    />
    <View style={styles.orderCardContent}>
      <Text style={styles.orderName}>{data?.customer?.fullName}</Text>
      <Text style={styles.orderCompany}>
        {order?.product?.supplierDTO?.companyName}
      </Text>
      <Text style={styles.orderProduct}>{order?.product?.productCategory}</Text>
      {/* <Text style={styles.orderDetails}>{order.productCategory}</Text> */}
      <Text style={styles.orderDetails}>Qty: {order?.product?.quantity}</Text>
      <Text style={styles.orderDetails}>
        Unit Price: {order?.product?.unitPrice}
      </Text>
    </View>
  </View>
);

const DriverDashboardORderDetails = ({navigation, route}) => {
  const queryClient = useQueryClient();
  const [modalVisibleReject, setModalVisibleReject] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otpmodalVisible, setOtpModalVisible] = useState(false);

  const [modalVisibleDeliver, setModalVisibleDeliver] = useState(false);
  const {order} = route.params || {};
  console.log(order, 'order');
  const {showToast} = useToast();
  const {mutate, isLoading} = usePost(`/orders/${order?.id}/driverAccepted`, {
    onError: (error, variables, context) => {
      showToast('Something went wrong please try again');

      console.error('Error sending request with id', error);
    },
    onSuccess: () => {
      setModalVisible(false);
      setOtpModalVisible(true);
      queryClient.invalidateQueries({queryKey: ['driver-cart']});
    },
  });

  const {mutate: rejectCart} = usePost(`/orders/${order?.id}/driverRejected`, {
    onError: (error, variables, context) => {
      showToast('Something went wrong please try again');
      console.error('Error sending request with id', error);
    },
    onSuccess: () => {
      showToast('Order rejected Successfully');
      setModalVisibleReject(false);
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#020202" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Request</Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.iconLabelRow}>
            <Icon name="location-on" size={20} color="#666" />
            <Text style={styles.cardLabel}>Delivery Address</Text>
          </View>
          <Text style={styles.cardValue}>
            {`${order.deliveryAddress.name}, ${order.deliveryAddress.addressLine1}, ${order.deliveryAddress.addressLine2}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country}, ${order.deliveryAddress.postalCode}`}
          </Text>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.iconLabelRow}>
            <Icon name="assignment" size={20} color="#666" />
            <Text style={styles.cardLabel}>Order ID</Text>
          </View>
          <Text style={styles.cardValue}>#{order.id}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Text style={styles.tabText}>Order Details</Text>
      </View>

      <FlatList
        data={order.items} // Duplicating the items 3 times
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys for each item
        renderItem={({item}) => (
          <OrderCard navigation={navigation} order={item} data={order} />
        )}
      />

      {order?.driverStatus === 'DRIVER_ACCEPTED' && (
        <Text style={styles.deliveryLabel}>Order Delivery Status</Text>
      )}
      {/* Dummy Map Placeholder */}
      {order?.driverStatus === 'DRIVER_ACCEPTED' && (
        <View style={styles.mapPlaceholder}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 20.7002,
              longitude: 77.0082,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      )}
      {order?.driverStatus === 'DRIVER_ASSIGNED' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.buttonAccept}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisibleReject(true)}
            style={styles.buttonReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {order?.driverStatus === 'DRIVER_ACCEPTED' && (
        <View style={styles.buttonContainerDeliver}>
          <TouchableOpacity
            onPress={() => setModalVisibleDeliver(true)}
            style={styles.buttonAcceptDeliver}>
            <Text style={styles.buttonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        </View>
      )}
      <DynamicModal
        modalVisible={modalVisibleReject}
        onRequestClose={() => setModalVisibleReject(false)}
        message="Are you sure do you want to reject this order?"
        onSuccess={rejectCart}
        successButtonText="Reject"
        cancelButtonText="Cancel"
      />
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure do you want to accept this order?"
        onSuccess={mutate}
        successButtonText="Approve"
        cancelButtonText="Cancel"
      />
      <DynamicModal
        modalVisible={modalVisibleDeliver}
        onRequestClose={() => setModalVisibleDeliver(false)}
        message="Are you sure do you want to mark as delivered"
        onSuccess={mutate}
        successButtonText="OK"
        cancelButtonText="Cancel"
      />
      <OtpModal
        setModalVisibleDeliver={setModalVisibleDeliver}
        order={order}
        visible={otpmodalVisible}
        onClose={() => setOtpModalVisible(false)}
        onOtpSubmit={() => {}}
      />
    </SafeAreaView>
  );
};

export default DriverDashboardORderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginTop: 30,
  },

  map: {
    width: 350,
    height: 200,
  },
  deliveryLabel: {
    marginHorizontal: 25,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black',
  },
  mapPlaceholder: {
    height: 200, // Placeholder height for the map
    marginHorizontal: 20,
    // backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 50,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#020202',
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgray',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardRow: {
    marginBottom: 10,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 14,
    color: '#444',
    marginTop: 5, // Add spacing between label and value
    alignSelf: 'flex-start', // Align the text to the start
  },
  tabContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabText: {
    fontSize: 16,
    color: '#2891e0',
    fontWeight: 'bold',
  },
  orderList: {
    flex: 1,

    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderCard: {
    marginHorizontal: 20,
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    // marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
    resizeMode: 'contain', // Ensures the image covers the entire area
  },
  orderCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCompany: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
  },
  orderProduct: {
    fontSize: 15,
    marginTop: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 30,
  },
  buttonAccept: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  buttonContainerDeliver: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 30,
  },
  buttonAcceptDeliver: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  buttonReject: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
