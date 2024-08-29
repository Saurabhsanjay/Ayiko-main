import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {FAlert} from 'components';
import {useToast} from 'contexts/ToastContext';
import usePost from 'hooks/usePost';
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const OtpModal = ({
  visible,
  onClose,
  onOtpSubmit,
  order,
  setModalVisibleDeliver,
}) => {
  const [otp, setOtp] = React.useState('');
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const [alertVisibleAvailability, setAlertVisibleAvailability] =
    useState(false);

  const handleOkClick = () => {
    setAlertVisibleAvailability(false);
  };

  const handleCancelClick = () => {
    setAlertVisibleAvailability(false);
  };
  const {mutate: markAsDeilver} = usePost(
    `/orders/${order?.id}/completeDelivery`,
    {
      onError: (error, variables, context) => {
        console.error('Error sending request with id', error);
        showToast('Something went wrong. Please try again.');
        setModalVisibleDeliver(false);
        onClose();
      },
      onSuccess: () => {
        setAlertVisibleAvailability(true);
        navigation.navigate('DriverHomeScreen');
        queryClient.invalidateQueries({queryKey: ['driver-cart']});
        // showToast('Cart Rejected successfully');
      },
    },
  );

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter OTP</Text>
          <Text style={styles.modalMessage}>
            Enter OTP sent on customer’s registered mobile number.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6} // Assuming a 6-digit OTP
          />
          <Pressable
            style={styles.submitButton}
            onPress={() => markAsDeilver()}>
            <Text style={styles.submitButtonText}>OK</Text>
          </Pressable>
        </View>
      </View>
      <FAlert
        show={alertVisibleAvailability}
        okClick={handleOkClick}
        cancelClick={handleCancelClick}
        title="Congratulations !!"
        subTitle="You delivered the order successfully."
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#44aafc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OtpModal;
