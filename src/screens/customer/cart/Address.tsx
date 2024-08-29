import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AddNewAddress from '../AddNewAddress';
import useFetch from 'hooks/useFetch';
import {TAddress} from 'types/address';
import {useAppDispatch, useAppSelector} from 'hooks';
import usePost from 'hooks/usePost';
import {useToast} from 'contexts/ToastContext';
import {getCustomerByToken} from 'store/slices/authSlice';
import Feather from 'react-native-vector-icons/Feather';
const AddressScreen = ({onNext}) => {
  const dispatch = useAppDispatch();
  const {customerData} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(getCustomerByToken());
  }, [dispatch]);

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

  const {data: customer, refetch} = useFetch<TAddress>(
    ['customer-address', customerData?.id],
    `/customers/${customerData?.id}`,
    true,
  );

  const cartItems = useAppSelector(state => state.cart.items);

  const {mutate, isLoading} = usePost('/cart/sendForApproval', {
    onError: (error, variables, context) => {
      console.error(`Error sending request with id ${context?.id}:`, error);
      showToast('Something went wrong. Please try again.');
    },
    onSuccess: (data, variables, context) => {
      showToast('Request sent successfully');
      onNext();
    },
  });

  const {showToast} = useToast();

  const sendForApprove = () => {
    const cartData = {
      id: customer?.id,
      supplierId: cartItems?.[0]?.supplierId,
      customerId: customer?.id,
      items: cartItems?.map(el => ({
        id: el.id,
        productId: el.id,
        quantity: el.cartQuantity,
      })),
      deliveryAddress: {
        id: selectedAddress,
      },
    };
    mutate(cartData);
  };

  const addresses = customer?.deliveryAddresses || [];

  const handleAddressSelection = addressId => {
    setSelectedAddress(addressId);
  };

  const toggleAddNewAddress = () => {
    setIsNewAddress(!isNewAddress);
  };

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  return (
    <View style={styles.container}>
      {isNewAddress ? (
        <View style={styles.addNewAddressContainer}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={toggleAddNewAddress}>
            <Feather name="x" size={20} color="#000" />
          </TouchableOpacity>
          <AddNewAddress setIsNewAddress={setIsNewAddress} refetch={refetch} />
        </View>
      ) : (
        <ScrollView>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddNewAddress}>
            <Text style={styles.addButtonText}>+ ADD NEW ADDRESS</Text>
          </TouchableOpacity>

          <View style={styles.addressContainer}>
            {addresses.map(address => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressItem,
                  selectedAddress === address.id && styles.selectedAddress,
                ]}
                onPress={() => handleAddressSelection(address.id)}>
                <View>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text
                    style={
                      styles.addressText
                    }>{`${address.addressLine1}, ${address.addressLine2}`}</Text>
                  <Text style={styles.addressText}>{address.phoneNumber}</Text>
                  <Text
                    style={
                      styles.addressText
                    }>{`${address.city}, ${address.state}, ${address.country}`}</Text>
                </View>
                {selectedAddress === address.id ? (
                  <Icon name="dot-circle" size={20} color="#2196f3" />
                ) : (
                  <Icon name="circle" size={20} color="#2196f3" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {!isNewAddress && (
        <TouchableOpacity
          style={styles.sendRequestButton}
          onPress={sendForApprove}>
          <Text style={styles.sendRequestButtonText}>Send Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addNewAddressContainer: {
    flex: 1,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 10,
  },
  addressContainer: {
    marginTop: 10,
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 8,
  },
  selectedAddress: {
    borderColor: '#2196f3',
    backgroundColor: '#f0f8ff',
  },
  addressName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  addButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sendRequestButton: {
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendRequestButtonText: {
    color: 'white',
  },
});

export default AddressScreen;
