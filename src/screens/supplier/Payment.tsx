import {useQueryClient} from '@tanstack/react-query';
import {FAlert} from 'components';
import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DynamicModal from 'screens/customer/cart/CustomModal';

const ProductItem = ({item}) => (
  <View style={styles.productItem}>
    <Image
      source={{
        uri:
          item?.product?.imageUrl?.[0]?.imageUrl ||
          'https://via.placeholder.com/100',
      }}
      style={styles.productImage}
    />
    <Text style={styles.productName}>
      {item?.product?.name?.charAt(0)?.toUpperCase() +
        item?.product?.name?.slice(1)}
    </Text>
    <Text style={styles.productQuantity}>
      {item.quantity} {item?.product?.category}
    </Text>
    <Text
      style={[
        styles.productStock,
        item?.product?.available ? styles.inStock : styles.outOfStock,
      ]}>
      {item?.product?.available ? 'In Stock' : 'Out of Stock'}
    </Text>
  </View>
);

const Payment = ({onNext, order}) => {
  const [alertVisiblePayment, setalertVisiblePayment] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleReject, setModalVisibleReject] = useState(false);
  const handleOkClick = () => {
    setalertVisiblePayment(false);
    setModalVisible(false);
    onNext();
  };

  const handleCancelClick = () => {
    setalertVisiblePayment(false);
    setModalVisible(false);
    onNext();
  };
  const totalPrice = order?.items?.reduce((acc, item) => {
    return acc + parseFloat(item.product.unitPrice) * item.quantity;
  }, 0);
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  const {mutate, isLoading} = usePost(
    `/cart/${order?.id}/addPaymentReceiptStatus?status=CONFIRMED`,
    {
      onError: (error, variables, context) => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['supplier-cart']});
        setalertVisiblePayment(true);
        setalertVisiblePayment(true);
      },
    },
  );

  const {mutate: rejectPayment} = usePost(
    `/cart/${order?.id}/addPaymentReceiptStatus?status=REJECTED`,
    {
      onError: error => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        showToast('Payment Rejected');
        queryClient.invalidateQueries({queryKey: ['supplier-cart']});
        onNext();
      },
    },
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.name}>{order?.customer?.fullName}</Text>

        <View style={styles.row}>
          <Icon name="map-pin" size={16} color="#666" style={styles.icon} />
          <View style={styles.column}>
            <Text style={styles.label}>Delivery Address:</Text>
            <Text style={styles.value}>
              {order?.deliveryAddress?.addressLine1},{' '}
              {order?.deliveryAddress?.addressLine2}
              {order?.deliveryAddress?.addressLine2 ? ',' : ''}{' '}
              {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state},{' '}
              {order?.deliveryAddress?.country},{' '}
              {order?.deliveryAddress?.postalCode},{' '}
              {order?.deliveryAddress?.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="list" size={16} color="#666" style={styles.icon} />
          <View style={styles.column}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>#{order?.id}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.name}>Order Details</Text>
      </View>
      <FlatList
        data={order?.items}
        renderItem={ProductItem}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.billDetails}>
        <Text style={styles.billDetailsTitle}>Billing Details</Text>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Subtotal</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Promocode</Text>
          <Text style={styles.billingValue}>0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Delivery Fee</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Tax & other Fee</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.billingRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rs. {totalPrice}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.button, styles.approveButton]}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibleReject(true)}
          style={[styles.button, styles.rejectButton]}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure you want to approve Payment?"
        onSuccess={mutate}
        successButtonText="Approve"
        cancelButtonText="Cancel"
      />
      <FAlert
        show={alertVisiblePayment}
        okClick={handleOkClick}
        cancelClick={handleCancelClick}
        title="Approved !!"
        subTitle="Payment Approved successfully"
      />
      <DynamicModal
        modalVisible={modalVisibleReject}
        onRequestClose={() => setModalVisibleReject(false)}
        message="Are you sure you want to reject Payment?"
        onSuccess={rejectPayment}
        successButtonText="Reject"
        cancelButtonText="Cancel"
      />
    </ScrollView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  orderDetails: {
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#454545',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  column: {
    flex: 1, // Take up remaining space in the row
  },
  icon: {
    marginRight: 8,
    marginTop: 3, // Align icon with text baseline
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    flexWrap: 'wrap',
  },
  //   productList: {
  //     padding: 8,
  //   },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  productQuantity: {
    fontSize: 13,
    marginBottom: 3,
  },
  productStock: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
  },
  billDetails: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  billDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
  },
  billingValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF', // You can change this color to match your app's theme
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  approveButton: {
    backgroundColor: '#0fc300', // Green color for approve
  },
  rejectButton: {
    backgroundColor: '#fe0000', // Red color for reject
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
