import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // Import the icon library

import Availability from './supplier/Availability';
import Payment from './supplier/Payment';
import AssignDriver from './supplier/AssignDriver';
import TrackSupplier from './supplier/Track';

const steps = ['Availability', 'Payment', 'Assign Driver', 'Track'];
const Header = ({currentStep, onBack, navigation, orderStatus}) => {
  const headerTitle =
    currentStep === 1 && orderStatus === null
      ? 'Payment Pending'
      : steps[currentStep];

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => (currentStep === 0 ? navigation.goBack() : onBack())}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{headerTitle}</Text>
      <View style={{width: 24}} />
    </View>
  );
};

const StepperSupplierScreen = ({navigation, route}) => {
  const {order} = route.params || {};
  console.log(order, 'os');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (order?.status === 'ACCEPTED') {
      setCurrentStep(1);
    }
    if (order?.orderId != null) {
      setCurrentStep(2);
    }
  }, [order?.orderId, order?.status, order]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (order?.status === 'ACCEPTED' || order?.orderId != null) {
      navigation.navigate('SupplierHomeScreen');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Order completed!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        orderStatus={order?.status}
        currentStep={currentStep}
        onBack={handleBack}
        navigation={navigation}
      />
      {currentStep !== 3 && (
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

      {currentStep === 0 && (
        <Availability
          setCurrentStep={setCurrentStep}
          order={order}
          onNext={handleNext}
        />
      )}
      {currentStep === 1 && (
        <Payment
          setCurrentStep={setCurrentStep}
          order={order}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 2 && (
        <AssignDriver order={order} onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <TrackSupplier
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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

export default StepperSupplierScreen;
