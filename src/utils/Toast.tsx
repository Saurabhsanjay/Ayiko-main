// components/Toast.tsx
import {useToast} from 'contexts/ToastContext';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const Toast: React.FC = () => {
  const {toastVisible, toastMessage, hideToast} = useToast();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (toastVisible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        hideToast();
      });
    }
  }, [toastVisible]);

  if (!toastVisible) return null;

  return (
    <Animated.View style={[styles.container, {opacity}]}>
      <View style={styles.toastContainer}>
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Toast;
