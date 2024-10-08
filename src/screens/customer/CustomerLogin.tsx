import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {SVGLoginLogo} from 'assets/image';
import {FButton, FTextInput, Loader} from 'components';
import {useAppDispatch, useAppSelector} from 'hooks';

import {getCustomerByToken, login} from 'store/slices/authSlice';
import globalHelpers from '../../utils/helpers';

const CustomerLoginScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useAppDispatch();

  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const termsAndCondition = 'https://ayiko.net/TermsAndCondition.html';
  const privacyPolicy = 'https://ayiko.net/privacyPolicy.html';
  const aboutUs = 'https://ayiko.net/aboutUs.html';

  const [input, setInput] = useState([
    {
      order: 0,
      label: 'Username',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid username',
      key: 'username',
      fixLabel: true,
    },
    {
      order: 1,
      label: 'Password',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid password',
      key: 'password',
      rightIconName: 'eye',
      secureTextEntry: true,
    },
  ]);

  const onChangeText = (key: number, value: string) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].value = value;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
  };

  const onRightButtonClick = (key: number) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].secureTextEntry = !inputVal[key].secureTextEntry;
      inputVal[key].rightIconName = inputVal[key].secureTextEntry
        ? 'eye'
        : 'eye-off';
      setInput(() => [...inputVal]);
    }
  };

  const validateusername = (username: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(username);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const loginClick = () => {
    const inputValid = globalHelpers.validation(input);
    setInput(() => [...inputValid]);

    if (inputValid.valid) {
      const payload = {
        password: input[1].value,
        username: input[0].value?.toLowerCase()?.trim(),
      };
      console.log('payload', payload);

      dispatch(login(payload)).then(async (data: any) => {
        console.log('data', JSON.stringify(data, null, 2));
        if (data?.payload) {
          if (data?.type === 'auth/login/fulfilled') {
            await AsyncStorage.setItem('token', data?.payload);
            await AsyncStorage.setItem('role', 'customer');

            dispatch(getCustomerByToken());
            navigation.navigate('Home');
          } else {
            Alert.alert('Error', "You've entered wrong credentials", [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }
        } else {
          Alert.alert('Error', "You've entered wrong credentials", [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
        console.log('data', data);
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -150 : -150}>
      {/* <Loader isLoading={loading} /> */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <SVGLoginLogo />
        <View style={styles.content}>
          <FlatList
            data={input}
            keyboardShouldPersistTaps="handled"
            renderItem={({item, index}) => (
              <FTextInput
                {...item}
                containerStyle={styles.inputContainerStyle}
                onTextChange={text => onChangeText(index, text)}
                onRightButtonClick={() => onRightButtonClick(index)}
              />
            )}
          />
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
          <FButton
            label="Login"
            buttonClick={() => loginClick()}
            containerStyle={styles.btnContainerStyle}
          />
          <Text style={styles.account}>
            Don’t have an account?{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('SignUpWelcome')}>
              Sign Up
            </Text>
          </Text>
          <View style={styles.bottomText}>
            <Text
              style={styles.signUp}
              onPress={() => Linking.openURL(aboutUs)}>
              About Us
            </Text>
            <Text> | </Text>
            <Text
              style={styles.signUp}
              onPress={() => Linking.openURL(privacyPolicy)}>
              Privacy & policy
            </Text>
            <Text> | </Text>
            <Text
              style={styles.signUp}
              onPress={() => Linking.openURL(termsAndCondition)}>
              Terms & Conditions
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomerLoginScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
    content: {
      borderRadius: 30,
      backgroundColor: colors.white,
      padding: 24,
      paddingBottom: 48,
      flex: 1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    heading: {
      ...fonts.heading,
      color: colors.heading,
      textAlign: 'center',
      marginBottom: 40,
    },
    btnContainerStyle: {
      marginVertical: 8,
      marginTop: 32,
    },
    account: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 24,
    },
    inputContainerStyle: {},
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
    },
    forgotPassword: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
      textDecorationLine: 'underline',
    },
    signUp: {
      ...fonts.subHeading,
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 12,
      textDecorationLine: 'underline',
    },
    linkText: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    bottomText: {flexDirection: 'row', top: 10, justifyContent: 'center'},
  });
