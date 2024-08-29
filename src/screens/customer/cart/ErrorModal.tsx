import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';

interface CartModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  currentSupplier: string;
  newSupplier: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  currentSupplier,
  newSupplier,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Replace cart item?</Text>
          <Text style={styles.message}>
            Your cart contains items from {currentSupplier}. Do you want to
            discard the selection and add items from {newSupplier}?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0e6ff',

    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default CartModal;
