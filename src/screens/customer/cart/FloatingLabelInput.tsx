import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, TextInput, Animated} from 'react-native';

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
    left: 0,
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
    <Animated.View style={{paddingTop: 18}}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default FloatingLabelInput;
