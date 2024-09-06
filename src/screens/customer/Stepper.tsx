import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // Import the icon library
import CartStep from './cart/Cart';
import AddressScreen from './cart/Address';
import SupplierApproval from './cart/SupplierApproval';
import PaymentConfirmation from './cart/Payment';
import PrivateScreen from 'contexts/AuthScreen';
import {useAppDispatch, useAppSelector} from 'hooks';
import {clearCart} from 'store/slices/CartSlice';
import {useFocusEffect} from '@react-navigation/native';

const steps = ['CART', 'ADDRESS', 'APPROVAL', 'PAYMENT'];
const stepsHeading = ['CART', 'DELIVERY ADDRESS', 'APPROVAL', 'PAYMENT'];
const Header = ({currentStep, onBack, navigation, fromOrders, dispatch}) => {
  const handleBackPress = useCallback(() => {
    if (fromOrders) {
      navigation.navigate('MyOrders');
    } else if (currentStep === 0) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Home');
      dispatch(clearCart());
    }
    return true; // Prevent default back button behavior
  }, [fromOrders, currentStep, navigation, dispatch]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          if (fromOrders) {
            navigation.navigate('MyOrders'); // Navigate to MyOrders page
          } else if (currentStep === 0) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('Home');
            dispatch(clearCart());
          }
        }}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{stepsHeading[currentStep]}</Text>
      <View style={{width: 24}} />
    </View>
  );
};

const StepperScreen = ({navigation, route}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const {product, fromOrders} = route.params || {};
  const totalQuantity = useAppSelector(state => state.cart.items);
  console.log('Product', product, fromOrders);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Order completed!');
  };
  const customerData = useAppSelector(state => state.auth.customerData);

  useEffect(() => {
    if (fromOrders) {
      setCurrentStep(2);
    }
    if (product?.paymentDetails?.customerStatus === 'CONFIRMED') {
      setCurrentStep(3);
    }
  }, [fromOrders, product?.paymentDetails?.customerStatus]);

  if (!customerData?.id && currentStep > 0) {
    return <PrivateScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        dispatch={dispatch}
        currentStep={currentStep}
        onBack={handleBack}
        navigation={navigation}
        fromOrders={fromOrders} // Pass fromOrders to Header
      />
      {totalQuantity?.length > 0 && (
        <View style={styles.stepperContainer}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <View style={styles.stepContainer}>
                <View
                  style={[
                    styles.circle,
                    index === currentStep && styles.activeCircle,
                    index < currentStep && styles.completedCircle,
                  ]}>
                  {index < currentStep ? (
                    <Icon name="check" size={16} color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        index === currentStep && styles.activeStepNumber,
                      ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={styles.stepName}>{step}</Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentStep && styles.completedLine,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      )}

      {currentStep === 0 && <CartStep onNext={handleNext} />}
      {currentStep === 1 && (
        <AddressScreen onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 2 && (
        <SupplierApproval
          product={product}
          fromOrders={fromOrders}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <PaymentConfirmation
          product={product}
          onNext={handleNext}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  activeCircle: {
    borderColor: '#4cb4ff',
  },
  completedCircle: {
    backgroundColor: '#4cb4ff',
    borderColor: '#4cb4ff',
  },
  stepNumber: {
    color: '#000',
  },
  activeStepNumber: {
    color: '#000',
  },
  stepName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  line: {
    height: 2,
    width: 50,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  completedLine: {
    backgroundColor: '#4cb4ff',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StepperScreen;
