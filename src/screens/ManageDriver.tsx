import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import usePost from 'hooks/usePost';
import usePut from 'hooks/usePut';
import {useAppDispatch} from 'hooks';
import {getSupplierByToken} from 'store/slices/authSlice';
import {useToast} from 'contexts/ToastContext';
import {useQueryClient} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {RootState} from 'store';

const ManageDriver = ({route, navigation}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const {supplierData} = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  const {id, item} = route.params || {};

  const schema = useMemo(() => {
    const baseSchema = yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      mobileNo: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Invalid mobile number')
        .required('Mobile number is required'),
      vehicleNo: yup.string().required('Vehicle number is required'),
      isActive: yup.boolean(),
    });

    return id
      ? baseSchema
      : baseSchema.shape({
          password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        });
  }, [id]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      mobileNo: '',
      vehicleNo: '',
      password: '',
      isActive: true,
    },
  });

  const postMutation = usePost('/drivers');
  const putMutation = usePut(`/drivers/${id}`);

  useEffect(() => {
    dispatch(getSupplierByToken());
  }, [dispatch]);

  useEffect(() => {
    if (id && item) {
      reset({
        name: item.name,
        email: item.email,
        mobileNo: item.phone,
        vehicleNo: item.vehicleNumber,
        isActive: item.active,
      });
    }
  }, [id, item, reset]);

  const onSubmit = data => {
    console.log('Form submitted with data:', data);
    const payload = {
      id: id || '',
      name: data.name,
      email: data.email,
      phone: data.mobileNo,
      vehicleNumber: data.vehicleNo,
      password: id ? undefined : data.password,
      supplierId: supplierData?.id || '',
      status: 'AVAILABLE',
      location: {
        latitude: 0,
        longitude: 0,
      },
      profileImage: null,
      active: data.isActive,
    };

    const mutation = id ? putMutation : postMutation;
    mutation.mutate(payload, {
      onError: error => {
        console.error('Error submitting data:', error);
        console.error('Error details:', error.response?.data);
        showToast('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        showToast(
          id ? 'Driver updated successfully' : 'Driver added successfully',
        );
        navigation.goBack();
        queryClient.invalidateQueries({queryKey: ['drivers']});
      },
    });
  };

  const renderInput = (name, placeholder, secureTextEntry = false) => (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, onBlur, value}}) => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{placeholder}</Text>
          <TextInput
            style={[styles.input, errors[name] && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
          />
          {errors[name] && (
            <Text style={styles.errorText}>{errors[name].message}</Text>
          )}
        </View>
      )}
    />
  );

  return (
    <ScrollView style={styles.container}>
      {renderInput('name', 'Enter name')}
      {renderInput('email', 'Enter email')}
      {renderInput('mobileNo', 'Enter mobile number')}
      {renderInput('vehicleNo', 'Enter vehicle number')}
      {!id && renderInput('password', 'Enter password', true)}

      <Controller
        control={control}
        name="isActive"
        render={({field: {onChange, value}}) => (
          <View style={styles.switchContainer}>
            <Text style={styles.label}>
              {value ? 'Active Driver' : 'Inactive Driver'}
            </Text>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{false: colors.gray, true: colors.primary}}
              thumbColor={value ? colors.white : colors.lightGray}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>{id ? 'Update' : 'Onboard'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}>
        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      ...fonts.small,
      marginBottom: 5,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 10,
      fontSize: 16,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 5,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: 20,
    },
    cancelButtonText: {
      color: colors.primary,
    },
  });

export default ManageDriver;
