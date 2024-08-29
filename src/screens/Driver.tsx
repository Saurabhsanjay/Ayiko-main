import {useTheme} from '@react-navigation/native';
import {SVGAddDriver} from 'assets/image';
import React, {useState, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';

import Popover from 'react-native-popover-view';
import {Drivers} from 'types/supplier';
import useFetch from 'hooks/useFetch';
import usePost from 'hooks/usePost';
import {useToast} from 'contexts/ToastContext';
import {useQueryClient} from '@tanstack/react-query';

const DriverScreen = ({navigation, route}) => {
  const {colors, fonts} = useTheme();
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const {
    data: driverList,
    error,
    isLoading,
  } = useFetch(['drivers'], '/drivers', true);

  const {mutate: deactivateDriver} = usePost(
    `/api/v1/drivers/${selectedDriverId}/deactivateDriver`,
    {
      onSuccess: () => {
        showToast('Driver deactivated successfully');
        queryClient.invalidateQueries({queryKey: ['drivers']});
      },
      onError: () => {
        showToast('Something went wrong. Please try again.');
      },
    },
  );

  const styles = Styles({colors, fonts});

  const togglePopover = useCallback(
    driverId => {
      const updatedList = driverList.map(driver =>
        driver.id === driverId
          ? {...driver, popoverVisible: !driver.popoverVisible}
          : {...driver, popoverVisible: false},
      );
      queryClient.setQueryData(['drivers'], updatedList);
    },
    [driverList, queryClient],
  );

  const handleDeactivate = useCallback(
    driverId => {
      setSelectedDriverId(driverId);
      deactivateDriver();
      togglePopover(driverId);
    },
    [deactivateDriver, togglePopover],
  );

  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('ManageDriver', {
              id: item.id,
              item,
            });
          }}>
          <Image
            source={{
              uri:
                item?.imageUrl?.[0]?.imageUrl ||
                `https://via.placeholder.com/150?text=${item?.name?.charAt(0)}`,
            }}
            style={{
              resizeMode: 'cover',
              width: 50,
              height: 50,
              borderRadius: 50,
              // borderColor: colors.primary,
              borderWidth: 1,
            }}
          />
          <View style={styles.cardDescription}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <Popover
            from={sourceRef => (
              <TouchableOpacity
                ref={sourceRef}
                style={styles.popoverTrigger}
                onPress={() => togglePopover(item.id)}>
                <Feather name="more-vertical" size={25} color={colors.text} />
              </TouchableOpacity>
            )}
            isVisible={item.popoverVisible}
            onRequestClose={() => togglePopover(item.id)}>
            <View style={styles.popoverContainer}>
              <TouchableOpacity
                style={styles.popoverContent}
                onPress={() => {
                  togglePopover(item.id);
                  navigation.navigate('ManageDriver', {
                    id: item.id,
                    item,
                  });
                }}>
                <Feather name="edit-2" size={20} color={colors.text} />
                <Text style={styles.title}>Edit</Text>
              </TouchableOpacity>
              {item.active && (
                <TouchableOpacity
                  style={styles.popoverContent}
                  onPress={() => handleDeactivate(item.id)}>
                  <Feather name="refresh-cw" size={20} color={colors.text} />
                  <Text style={styles.title}>Deactivate</Text>
                </TouchableOpacity>
              )}
            </View>
          </Popover>
        </TouchableOpacity>
      );
    },
    [colors, navigation, styles, togglePopover, handleDeactivate],
  );

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>Error loading drivers</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate('ManageDriver')}
          style={styles.createButton}>
          <View style={styles.leftContent}>
            <View style={styles.plusIconContainer}>
              <Icon name="plus" size={20} color="#007AFF" />
            </View>
            <Text style={styles.buttonTextCatlog}>Add Driver</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#007AFF" />
        </Pressable>
        <View style={styles.listcotnaeiner}>
          <Text style={styles.heading}>Drivers List</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={driverList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const Styles = ({colors, fonts}) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    listcotnaeiner: {
      padding: 10,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: 15,
      margin: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    plusIconContainer: {
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderRadius: 5,
      padding: 5,
      marginRight: 10,
    },
    buttonTextCatlog: {
      color: '#007AFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
    container: {
      flex: 1,
      padding: 5,
      backgroundColor: colors.background,
    },
    addDriverContainer: {
      marginBottom: 20,
    },
    heading: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    card: {
      flexDirection: 'row',
      flex: 1,
      borderRadius: 10,
      backgroundColor: colors.white,
      marginVertical: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      padding: 11,
    },
    cardDescription: {
      marginLeft: 8,
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    popoverTrigger: {
      padding: 5,
    },
    popoverContent: {
      flexDirection: 'row',
      padding: 7,
      alignItems: 'center',
      gap: 10,
    },
    popoverContainer: {
      padding: 10,
    },
  });

export default DriverScreen;
