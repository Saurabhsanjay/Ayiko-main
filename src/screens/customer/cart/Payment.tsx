import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DynamicModal from './CustomModal';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';

const PaymentConfirmation = ({product}) => {
  console.log(product, 'pduct');
  const {showToast} = useToast();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true); // State for loader modal
  const queryClient = useQueryClient();

  const {mutate: paymentConfirm} = usePost(
    `/cart/${product?.id}/addPaymentConfirmationStatus`,
    {
      onError: (error, variables, context) => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
        setLoaderVisible(false); // Hide loader if there's an error
      },
      onSuccess: () => {
        showToast('Payment Confirmation sent successfully');
        queryClient.invalidateQueries({queryKey: ['customer-cart']});
        navigation.navigate('MyOrders');
        setLoaderVisible(false); // Hide loader on success
      },
    },
  );

  // Calculate the Order Total
  const calculateTotal = items => {
    return items
      ?.reduce((total, item) => {
        const quantity = item.quantity;
        const unitPrice = parseFloat(item.product.unitPrice);
        return total + quantity * unitPrice;
      }, 0)
      .toFixed(2); // Format the total to 2 decimal places
  };

  const orderTotal = calculateTotal(product?.items);

  const supplierImage =
    product?.supplier?.images?.[0]?.imageUrl ||
    'https://via.placeholder.com/80'; // Fallback image if none exists

  useEffect(() => {
    if (
      product?.paymentDetails?.supplierStatus === null &&
      product?.paymentDetails?.customerStatus === 'CONFIRMED'
    ) {
      setLoaderVisible(true);
    } else {
      setLoaderVisible(false);
    }
  }, [
    product?.paymentDetails?.customerStatus,
    product?.paymentDetails?.supplierStatus,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={{uri: supplierImage}} style={styles.supplierImage} />
      </View>

      <View style={styles.supplierContainer}>
        <Text style={styles.supplierName}>
          {product?.supplier?.companyName}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label="Name" value={product?.supplier?.companyName} />
        <DetailRow
          label="Account No."
          value={product?.supplier?.bankAccountNumber}
        />
        <DetailRow
          label="Mobile Money No."
          value={product?.supplier?.mobileMoneyNumber}
        />
        <DetailRow label="Order Total" value={`$${orderTotal}`} />
      </View>

      {product?.paymentDetails?.customerStatus !== 'CONFIRMED' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Payment Confirmation</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loader modal */}
      <Modal
        visible={loaderVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLoaderVisible(false)}>
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2196f3" />
            <Text style={styles.loaderHeading}>Payment Confirmation</Text>
            <Text style={styles.loaderSubheading}>
              Waiting for supplier's confirmation
            </Text>
          </View>
        </View>
      </Modal>

      {/* Confirmation modal */}
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure you want to send the payment confirmation?"
        onSuccess={paymentConfirm}
        successButtonText="Send"
        cancelButtonText="Cancel"
      />
    </View>
  );
};

const DetailRow = ({label, value}) => (
  <View style={styles.detailRow}>
    <Text style={[label === 'Order Total' && styles.boldText]}>
      {label === 'Order Total' ? 'Order Total' : label}
    </Text>
    <Text
      style={[styles.detailValue, label === 'Order Total' && styles.boldText]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  supplierImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
  },
  boldText: {
    fontWeight: 'bold',
  },
  supplierContainer: {
    padding: 2,
    borderRadius: 5,
    marginBottom: 20,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailValue: {
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loaderBox: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  loaderHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  loaderSubheading: {
    fontSize: 16,
    color: 'gray',
  },
});

export default PaymentConfirmation;
