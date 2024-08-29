import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
interface DynamicModalProps {
  modalVisible: boolean;
  onRequestClose: () => void;
  message: string;
  onSuccess: (event: GestureResponderEvent) => void;
  successButtonText?: string;
  cancelButtonText?: string;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  modalVisible,
  onRequestClose,
  message,
  onSuccess,
  successButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onRequestClose}>
              <Text style={styles.textStyle}>{cancelButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                successButtonText === 'Reject' || successButtonText === 'Delete'
                  ? styles.rejectButton
                  : styles.buttonConfirm,
              ]}
              onPress={onSuccess}>
              <Text style={styles.textStyle}>{successButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DynamicModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
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
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    minWidth: '45%',
  },
  buttonCancel: {
    backgroundColor: '#64748b',
  },
  buttonConfirm: {
    backgroundColor: '#44aafc',
  },
  rejectButton: {
    backgroundColor: '#fe0000', // Red color for reject
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
