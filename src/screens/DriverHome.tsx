import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import DriverDashboard from './driver/DriverDashboard';

const DriverHome = ({navigation}: any) => {
  return <DriverDashboard navigation={navigation} />;
};

export default DriverHome;

const styles = StyleSheet.create({});
