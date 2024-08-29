import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {S3} from 'aws-sdk';
import {useAppDispatch, useAppSelector} from 'hooks';
import {updateDriver} from 'store/slices/DriverSlice';
import {FAlert} from 'components';
import DynamicModal from 'screens/customer/cart/CustomModal';
const FloatingLabelInput = ({label, value, onChangeText}) => {
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
const s3 = new S3({
  accessKeyId: 'AKIAQXR5F2WXECSPPVG6',
  secretAccessKey: '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',
  region: 'af-south-1',
});

const EditProfile = ({navigation}) => {
  const dispatch = useAppDispatch();
  const driver = useAppSelector((state: any) => state.auth.driverData);
  const {loading} = useAppSelector(state => state.driver);
  const [activeTab, setActiveTab] = useState('Primary');
  const [fullName, setFullName] = useState(driver?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(driver?.phone || '');
  const [email, setEmail] = useState(driver?.email || '');
  const [gender, setGender] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [profileImage, setProfileImage] = useState(driver?.profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePicker = async () => {
    try {
      launchImageLibrary({mediaType: 'photo'}, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else {
          const file: Asset | undefined = response.assets?.[0];
          if (file) {
            setIsUploading(true); // Show loader
            const filePath = file.uri;
            const fetchResponse = await fetch(filePath!);
            const blob = await fetchResponse.blob();

            // Convert the blob to ArrayBuffer using FileReader
            const fileContent = await new Promise<ArrayBuffer>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as ArrayBuffer);
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
              },
            );

            const fileName = file.fileName || `${new Date().getTime()}.jpg`;

            const params = {
              Bucket: 'ayikos3bucket',
              Key: `images/${new Date().toISOString()}_${fileName}`,
              Body: fileContent,
              ContentType: file.type || 'image/jpeg',
            };

            s3.upload(params, (err, data) => {
              setIsUploading(false); // Hide loader
              if (err) {
                console.error('Error uploading image: ', err);
                Alert.alert(
                  'Upload Error',
                  'There was an error uploading the image.',
                );
              } else {
                console.log('Image uploaded successfully: ', data.Location);
                setProfileImage({
                  id: driver?.id || '',
                  imageUrl: data.Location,
                  imageType: file.type || 'image/jpeg',
                  imageTitle: fileName,
                  imageDescription: 'Profile picture',
                  profilePicture: true,
                });
                Alert.alert('Upload Success', 'Image uploaded successfully.');
              }
            });
          }
        }
      });
    } catch (error) {
      setIsUploading(false); // Hide loader
      console.error('Error in handleImagePicker: ', error);
      Alert.alert('Error', 'An error occurred during image selection.');
    }
  };

  const [alertVisible, setAlertVisible] = useState(false);

  const handleSave = () => {
    setIsUploading(true); // Show loader
    const updatedData = {
      id: driver?.id,
      name: fullName,
      email: email,
      phone: phoneNumber,
      vehicleNumber: driver?.vehicleNumber,
      password: driver?.password,
      supplierId: driver?.supplierId,
      status: driver?.status,
      location: driver?.location,
      updatedAt: new Date().toISOString(),
      lastLoginAt: driver?.lastLoginAt,
      profileImage: profileImage,
      active: driver?.active,
    };

    dispatch(updateDriver(updatedData as unknown as any))
      .then(() => {
        setAlertVisible(true); // Show alert on success
      })
      .catch(error => {
        console.error('Error updating driver: ', error);
        setAlertVisible(true); // Show alert on error
      })
      .finally(() => setIsUploading(false)); // Hide loader after updating
  };

  return (
    <ScrollView style={styles.container}>
      {isUploading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
        </View>
      )}
      <FAlert
        show={alertVisible}
        title="Update Complete"
        subTitle="Your profile has been updated successfully."
        okClick={() => {
          setAlertVisible(false);
          navigation.navigate('DriverHomeScreen');
        }}
        cancelClick={() => setAlertVisible(false)}
      />
      <DynamicModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        message="Are you sure do you want to delete your account ?"
        onSuccess={() => {}}
        successButtonText="Delete"
        cancelButtonText="Cancel"
      />
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
          <TouchableOpacity
            style={styles.addPictureButton}
            onPress={handleImagePicker}>
            <Image
              source={{
                uri:
                  profileImage?.imageUrl || 'https://via.placeholder.com/100',
              }}
              style={styles.image}
            />
            <Text style={styles.addPictureText}>ADD PICTURE</Text>
          </TouchableOpacity>

          <FloatingLabelInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <FloatingLabelInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <FloatingLabelInput
            label="Email ID"
            value={email}
            onChangeText={setEmail}
          />
          <FloatingLabelInput
            label="Gender"
            value={gender}
            onChangeText={setGender}
          />
          <FloatingLabelInput
            label="City"
            value={city}
            onChangeText={setCity}
          />
          <FloatingLabelInput
            label="State"
            value={state}
            onChangeText={setState}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.deleteAccountButton}>
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
  loaderContainer: {
    ...StyleSheet.absoluteFillObject, // Makes the container fill the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker semi-transparent background
    zIndex: 9999, // Optional: adds a semi-transparent background
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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingTop: 15,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 10,
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
  warningText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
});
