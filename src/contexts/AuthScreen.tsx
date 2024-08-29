import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';

const PrivateScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.navigate('CustomerAuth');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.content}>
        <Text style={styles.headerText}>Login Required</Text>
        <Text style={styles.subHeaderText}>Please login to continue</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Changed to pure white background
    padding: 20,
    borderRadius: 10,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2}, // for iOS shadow
    shadowOpacity: 0.25, // for iOS shadow
    shadowRadius: 3.84, // for iOS shadow
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center', // Center the text horizontally
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center', // Center the text horizontally
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#007AFF',
  },
});
