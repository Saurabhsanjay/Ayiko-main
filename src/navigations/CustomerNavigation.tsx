/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SupplierListScreen from '../screens/SuppliersList';
import AddBusinessInfo from 'screens/AddBusinessInfo';
import SupplierScreen from 'screens/SupplierScreen';
import ProductList from 'screens/ProductList';
import {getFocusedRouteNameFromRoute, useTheme} from '@react-navigation/native';
import {SVGProfilePic, SVGWaveIcon} from 'assets/image';
import {
  CatalogScreen,
  CongratulationScreen,
  HomeScreen,
  OrderDetailsScreen,
} from 'screens';
import OrderList from 'screens/OrderList';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import OrderDetail from 'screens/OrderDetail';
import {Address} from 'screens/Address';
import ManageAddress from 'components/ManageAddress';
import Search from 'screens/customer/Search';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductDetails from 'screens/customer/ProductDetails';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StepperScreen from 'screens/customer/Stepper';
import EditProfile from 'screens/customer/EditProfile';
import SupplierProducts from 'screens/customer/SupllierProducts';
import {useCartOperations} from 'hooks/useCartOperations';
import useCart from 'hooks/useCart';
import useCartStore from 'hooks/useCart';
import DriverDashboard from 'screens/driver/DriverDashboard';
import DriverOrderDetails from 'screens/driver/DriverOrderDetails';
import CustomerLoginScreen from 'screens/customer/CustomerLogin';
const Stack = createNativeStackNavigator();

const CustomerNavigation = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = ['ProductDetails', 'Stepper'];
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (tabHiddenRoutes.includes(routeName)) {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: styles.tabBarStyle});
    }
  }, [navigation, route]);
  const insets = useSafeAreaInsets();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts, insets});
  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );
  console.log(customerData, 'cdata');
  const totalQuantity = useAppSelector(state => state.cart.items);
  console.log('total', totalQuantity.length);

  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'black',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitleStyless,
        headerBackTitleVisible: false,
        headerRight: () => (
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <Icon name="globe" size={30} color="#2a96ec" />
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Stepper')}>
              <Icon name="cart" size={30} color="#2a96ec" />
              {totalQuantity?.length > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalQuantity?.length || 0}
                  </Text>
                </View>
              ) : (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{0}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ),
      }}>
      <Stack.Screen
        name="Search"
        component={Search}
        options={({navigation}) => ({
          title: '',

          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>SEARCH</Text>
          ),
          // headerRight: () => (
          //   <View>
          //     <TouchableOpacity onPress={() => navigation.navigate('Stepper')}>
          //       <Icon name="cart" size={24} color="white" />
          //     </TouchableOpacity>
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={({navigation}) => ({
          title: '',

          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>
              EDIT PROFILE INFORMATION
            </Text>
          ),
          // headerRight: () => (
          //   <View>
          //     <TouchableOpacity onPress={() => navigation.navigate('Stepper')}>
          //       <Icon name="cart" size={24} color="white" />
          //     </TouchableOpacity>
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="SupplierProduct"
        component={SupplierProducts}
        options={({navigation, route}: any) => ({
          title: '',

          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>
              {route.params.supplierName}
            </Text>
          ),
          // headerRight: () => (
          //   <View>
          //     <TouchableOpacity onPress={() => navigation.navigate('Stepper')}>
          //       <Icon name="cart" size={24} color="white" />
          //     </TouchableOpacity>
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="Stepper"
        component={StepperScreen}
        options={({navigation}) => ({
          headerShown: false,
          title: '',
          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>CART</Text>
          ),
        })}
      />
      <Stack.Screen
        name="CustomerAuth"
        component={CustomerLoginScreen}
        options={({navigation}) => ({
          headerShown: false,
          title: '',
          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>CART</Text>
          ),
        })}
      />
      <Stack.Screen
        name="Driver"
        component={DriverDashboard}
        options={({navigation}) => ({
          headerShown: false,
          title: '',
          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>CART</Text>
          ),
        })}
      />
      <Stack.Screen
        name="DriverOrder"
        component={DriverOrderDetails}
        options={({navigation}) => ({
          headerShown: false,
          title: '',
          headerTitle: () => (
            <Text style={styles.headerTitleStyless}>CART</Text>
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({navigation}) => ({
          title: '',

          
        })}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Image
                source={{
                  uri:
                    customerData?.profileImage?.imageUrl ||
                    'https://via.placeholder.com/150',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 5,
                }}
              />
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.headerTitleStyles}>Hello, </Text>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Let's Shop!
                </Text>
              </View>
            </View>
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //     onPress={() => navigation.navigate('UserProfileScreen')}>
          //     {/* <SVGProfilePic /> */}
          //     <Image
          //       source={require('../assets/image/profilePic.png')}
          //       style={{
          //         resizeMode: 'cover',
          //         width: 50,
          //         height: 50,
          //       }}
          //     />
          //   </TouchableOpacity>
          // ),
        })}
      />
      <Stack.Screen
        options={{
          title: 'Neha Nandanikar',
        }}
        initialParams={{catalogData: null}}
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />
      <Stack.Screen
        options={{
          title: 'Business Info',
        }}
        initialParams={{catalogData: null}}
        name="AddBusinessInfo"
        component={AddBusinessInfo}
      />
      <Stack.Screen
        name="SupplierListScreen"
        component={SupplierListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupplierScreen"
        component={SupplierScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={({navigation}) => ({
          title: 'Catalog',
        })}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{
          title: 'My Orders',
        }}
      />
      <Stack.Screen
        name="AddressScreen"
        component={Address}
        options={({navigation, route}) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View>
              <Text style={[styles.headerTitleStyless]}>Addresses</Text>
            </View>
          ),
          headerRight: () => {
            return (
              <>
                <View></View>
              </>
            ); /* <HeaderButtons CustomComponent={AddTo*/
          },
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="ManageAddressScreen"
        component={ManageAddress}
        options={({navigation, route}) => ({
          headerLeft: () => {
            return (
              <TouchableOpacity
                // style={{width: '35%'}}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <Feather name="arrow-left" size={25} color={colors.white} />
              </TouchableOpacity>
            );
          },
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View>
              <Text style={[styles.headerTitleStyless]}>Manage Address</Text>
            </View>
          ),
          headerRight: () => {
            return (
              <>
                <View></View>
              </>
            ); /* <HeaderButtons CustomComponent={AddTo*/
          },
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="OrderDetailScreen"
        component={OrderDetail}
        options={({navigation, route}) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View>
              <Text style={[styles.headerTitleStyless]}>OrderDetail</Text>
            </View>
          ),
          tabBarStyle: {
            display: 'none',
          },

          // headerRight: () => <View></View>,
          headerShown: true,
          // title: 'Cart',
          // tabBarIcon: ({color}) => <SVGCart fill={color} strokeWidth="2" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigation;

const Styles = ({colors, fonts, insets}: any) =>
  StyleSheet.create({
    headerTitleStyles: {
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
    },
    headerTitleStyless: {fontWeight: 'bold', fontSize: 16, color: 'black'},
    tabBarStyle: {
      height: Platform.OS === 'ios' ? insets.bottom + 60 : insets.bottom + 70,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      elevation: 4,
      shadowOpacity: 1,
      paddingVertical: 16,
      // alignItems: 'center',
    },
    tabBarLabelStyle: {
      // ...Fonts.title(14),
      fontFamily: 'knockout',
      fontSize: 14,
    },
    cartButton: {
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      right: -6,
      top: -6,
      backgroundColor: '#c2e6ff',
      borderRadius: 9,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#2296f5',
      fontSize: 12,
      fontWeight: 'bold',
    },
    headerLeft: {flexDirection: 'row', gap: 5},
  });
