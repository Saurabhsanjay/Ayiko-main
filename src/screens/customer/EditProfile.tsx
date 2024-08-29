import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const FloatingLabelInput = ({icon, label, value, onChangeText}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(
    new Animated.Value(value === '' ? 0 : 1),
  ).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 4,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#007AFF'],
    }),
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </View>
  );
};

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('Primary');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Primary' && styles.activeTab]}
          onPress={() => setActiveTab('Primary')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Primary' && styles.activeTabText,
            ]}>
            Primary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Settings' && styles.activeTab]}
          onPress={() => setActiveTab('Settings')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Settings' && styles.activeTabText,
            ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Primary' ? (
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.addPictureButton}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.image}
            />
            <Text style={styles.addPictureText}>ADD PICTURE</Text>
          </TouchableOpacity>

          <FloatingLabelInput
            icon="user"
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <FloatingLabelInput
            icon="phone"
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <FloatingLabelInput
            icon="mail"
            label="Email ID"
            value={email}
            onChangeText={setEmail}
          />
          <FloatingLabelInput
            icon="users"
            label="Gender"
            value={gender}
            onChangeText={setGender}
          />
          <FloatingLabelInput
            icon="map-pin"
            label="Pin Code"
            value={pinCode}
            onChangeText={setPinCode}
          />
          <FloatingLabelInput
            icon="home"
            label="City"
            value={city}
            onChangeText={setCity}
          />
          <FloatingLabelInput
            icon="map"
            label="State"
            value={state}
            onChangeText={setState}
          />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.deleteAccountButton}>
            <Feather
              name="trash-2"
              size={20}
              color="#FF3B30"
              style={styles.deleteIcon}
            />
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.warningText}>
            You will not be able to access your personal data including your old
            orders, saved addresses, payment methods etc.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  addPictureButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addPictureText: {
    color: '#000',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingTop: 15,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteIcon: {
    marginRight: 10,
  },
  deleteAccountText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
