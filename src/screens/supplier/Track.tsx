import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const TrackSupplier = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {id: 1, title: 'Assigned to driver'},
    {id: 2, title: 'On the way'},
    {id: 3, title: 'Delivered'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} />

        {showPopup && (
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPopup(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.popupContent}>
              <Icon name="delivery-dining" size={60} color="#000" />
              <Text style={styles.popupText}>Delivery Information</Text>
              <Text style={styles.popupSubText}>Your order is on its way!</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.infoContainer}>
        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTimeText}>Estimated Delivery Time:</Text>
          <Text style={styles.estimatedTime}>30-45 minutes</Text>
        </View>

        <View style={styles.stepperContainer}>
          <View style={styles.stepperLine} />
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepperItem}>
              <View
                style={[
                  styles.radioOuter,
                  step.id <= currentStep && styles.radioOuterActive,
                ]}>
                {step.id <= currentStep && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.stepperText,
                  step.id <= currentStep && styles.stepperTextActive,
                ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsBox}>
          <Text style={styles.detailsText}>Neha Nandanikar</Text>
          <View>
            <Text style={styles.subText}>Order Id: #12345678910</Text>
            <Text style={styles.subText}>
              Delivery Address: New sangvi, Pune
            </Text>

            <Text style={styles.subText}>Qty: 4</Text>
          </View>
        </View>

        <View style={styles.driverContainer}>
          <Image
            source={{uri: 'https://via.placeholder.com/50'}}
            style={styles.driverIcon}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>John Doe</Text>
            <Text style={styles.driverInfo}>MH-4659</Text>
            <Text style={styles.driverInfo}>Honda</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Feather name="phone" size={23} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  popup: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    height: '55%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  popupContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  popupSubText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 15,
    maxHeight: '50%',
    marginTop: 10,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  estimatedTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 16,
  },
  stepperContainer: {
    marginLeft: 10,
    position: 'relative',
  },
  stepperLine: {
    position: 'absolute',
    left: 11,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#ccc',
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 15,
    zIndex: 1,
  },
  radioOuterActive: {
    borderColor: '#2196F3',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  stepperText: {
    fontSize: 16,
    color: '#666',
  },
  stepperTextActive: {
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  detailsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    // marginBottom: 16,

    // Subtle shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    // Subtle elevation for Android
    elevation: 2,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 15,
    marginBottom: 5,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  driverIcon: {
    marginRight: 15,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  driverInfo: {
    fontSize: 14,
  },
  callButton: {
    padding: 5,
  },
});

export default TrackSupplier;
