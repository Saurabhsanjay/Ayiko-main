import {useToast} from 'contexts/ToastContext';
import {useAppSelector} from 'hooks';
import usePost from 'hooks/usePost';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export interface TAddress {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  name: string;
  phoneNumber: string;
  ownerId: string;
  ownerType: string;
  location: Location;
  default: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

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

const Divider = () => <View style={styles.divider} />;

const Chip = ({label, selected, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected
          ? {backgroundColor: '#c0e6ff'}
          : {borderColor: '#ccc', borderWidth: 1},
      ]}>
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
};

const AddNewAddress = ({setIsNewAddress, refetch}) => {
  const [fullName, setFullName] = useState('saurabh');
  const [phoneNumber, setPhoneNumber] = useState('8668727151');
  const [houseBuilding, setHouseBuilding] = useState('abcd');
  const [roadArea, setRoadArea] = useState('abcd');
  const [pinCode, setPinCode] = useState('444001');
  const [city, setCity] = useState('akola');
  const [state, setState] = useState('delhi');
  const [landmark, setLandmark] = useState('akl;aa');
  const [selectedChip, setSelectedChip] = useState('Home');
  const {showToast} = useToast();
  const handleChipSelection = (chip: React.SetStateAction<string>) => {
    setSelectedChip(chip);
  };
  const {customerData} = useAppSelector(state => state.auth);
  const {mutate, isLoading, error, status} = usePost<TAddress>(
    `/customers/${customerData?.id}/addAddress`,
    {
      onError: (error, variables, context) => {
        console.error(`Error sending request with id ${context?.id}:`, error);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: (data, variables, context) => {
        showToast('Address saved successfully');
        setIsNewAddress(false);
        refetch();
      },
    },
  );
  console.log(error, status);

  const addAddress = () => {
    const postData = {
      id: customerData?.id,
      addressLine1: houseBuilding,
      addressLine2: roadArea,
      city: city,
      state: state,
      country: state,
      postalCode: pinCode,
      name: fullName,
      phoneNumber: phoneNumber,
      ownerId: customerData?.id,
      ownerType: 'string',
      location: {
        latitude: 0,
        longitude: 0,
      },
      default: true,
    };
    mutate(postData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <Toast /> */}
      <View
        style={{
          height: 5,
          borderTopWidth: 1,
          borderColor: '#e5e7eb',
          marginBottom: 10,
        }}
      />
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>
          <Feather
            name="phone"
            size={16}
            color="black"
            style={styles.locationIcon}
          />{' '}
          Contact Details
        </Text>
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
      </View>
      <Divider />
      <View style={styles.section}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.sectionHeading}>
            <Feather
              name="map-pin"
              size={16}
              color="black"
              style={styles.locationIcon}
            />{' '}
            Address
          </Text>
          <View style={styles.useLocationContainer}>
            <Feather
              name="map-pin"
              size={16}
              color="black"
              style={styles.locationIcon}
            />
            <Text style={styles.useLocationText}>Use my location</Text>
          </View>
        </View>

        <FloatingLabelInput
          icon="home"
          label="House no. / Building Name"
          value={houseBuilding}
          onChangeText={setHouseBuilding}
        />
        <FloatingLabelInput
          icon="map"
          label="Road Name / Area / Colony"
          value={roadArea}
          onChangeText={setRoadArea}
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
        <FloatingLabelInput
          icon="map-pin"
          label="Landmark"
          value={landmark}
          onChangeText={setLandmark}
        />

        <View style={styles.chipsContainer}>
          <Chip
            label="Home"
            selected={selectedChip === 'Home'}
            onPress={() => handleChipSelection('Home')}
          />
          <Chip
            label="Work"
            selected={selectedChip === 'Work'}
            onPress={() => handleChipSelection('Work')}
          />
          <Chip
            label="Other"
            selected={selectedChip === 'Other'}
            onPress={() => handleChipSelection('Other')}
          />
        </View>
      </View>

      <TouchableOpacity onPress={addAddress} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Address & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555555',
  },
  divider: {
    borderBottomWidth: 4,
    borderBottomColor: '#c0e6ff',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    height: 50,
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
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  useLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#c0e6ff',
    borderRadius: 5,
  },
  locationIcon: {
    marginRight: 10,
  },
  useLocationText: {
    fontSize: 14,
    color: '#555555',
  },
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 14,
    color: '#555555',
  },
});
