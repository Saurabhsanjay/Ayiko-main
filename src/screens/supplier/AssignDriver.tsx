/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import useFetch from 'hooks/useFetch';
import {Drivers} from 'types/supplier';
import usePost from 'hooks/usePost';
import {useAppSelector} from 'hooks';
import {getSupplierByToken} from 'store/slices/authSlice';
import {useToast} from 'contexts/ToastContext';
import DynamicModal from 'screens/customer/cart/CustomModal';
import {useQueryClient} from '@tanstack/react-query';
import {FAlert} from 'components';

interface TDriverItem {
  item: Drivers;
  onAssign: (driver: Drivers) => void;
}

const DriverItem = ({item, onAssign}: TDriverItem) => (
  <View>
    <View style={styles.driverItem}>
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{item.name}</Text>
        <Text style={styles.driverNumber}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.assignButton}
        onPress={() => onAssign(item)}>
        <Text style={styles.assignButtonText}>Assign</Text>
      </TouchableOpacity>
      <Image
        source={{uri: item.image || 'https://via.placeholder.com/50'}}
        style={styles.driverImage}
      />
    </View>
    <View style={styles.divider} />
  </View>
);

const AssignDriver = ({order, onNext}) => {
  console.log(order, 'ods');
  const {
    data: driverList,
    error,
    isLoading,
  } = useFetch<Drivers[]>(['drivers'], '/drivers', true);

  const [selectedDriver, setSelectedDriver] = useState<Drivers | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {supplierData} = useAppSelector(state => state.auth);
  const queryClient = useQueryClient();
  const [alertVisibleAssignDriver, setAlertVisibleAssignDriver] =
    useState(false);

  const handleOkClick = () => {
    setAlertVisibleAssignDriver(false);
    setModalVisible(false);
    onNext();
  };

  const handleCancelClick = () => {
    setAlertVisibleAssignDriver(false);
    setModalVisible(false);
    onNext();
  };

  useEffect(() => {
    getSupplierByToken();
  }, []);

  const handleAssign = (driver: Drivers) => {
    setSelectedDriver(driver);
    setModalVisible(true);
  };

  const {showToast} = useToast();

  const {mutate: assignSelf} = usePost(
    `/orders/${order?.orderId}/assignToSelf`,
    {
      onError: (error, variables, context) => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        setAlertVisibleAssignDriver(true);
      },
    },
  );

  const {mutate: assignToDriver} = usePost(
    `/orders/${order?.orderId}/assignDriver/${selectedDriver?.id}`,
    {
      onError: error => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['supplier-cart']});
        setAlertVisibleAssignDriver(true);
      },
    },
  );

  const assignToSelf = {
    id: 'self',
    name: 'Self',
    phone: supplierData?.companyName || '',
    image: supplierData?.image || 'https://via.placeholder.com/50',
  };

  const allDrivers = [assignToSelf, ...(driverList || [])];

  const handleModalConfirm = () => {
    if (selectedDriver?.id === 'self') {
      assignSelf();
    } else {
      assignToDriver();
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Driver</Text>
      <FlatList
        data={allDrivers}
        renderItem={({item}) => (
          <DriverItem item={item} onAssign={handleAssign} />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message={`Assign order to ${selectedDriver?.name}`}
        onSuccess={handleModalConfirm}
        successButtonText="Assign"
        cancelButtonText="Cancel"
      />
      <FAlert
        show={alertVisibleAssignDriver}
        okClick={handleOkClick}
        cancelClick={handleCancelClick}
        title="Driver Assigned !!"
        subTitle="The driver has been successfully assigned to your order."
      />
    </View>
  );
};

export default AssignDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 8,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  driverNumber: {
    fontSize: 14,
    color: '#666',
  },
  assignButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 12,
  },
  assignButtonText: {
    color: 'white',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: '45%',
  },
  buttonCancel: {
    backgroundColor: '#ccc',
  },
  buttonConfirm: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
