/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Pressable,
  Platform,
  PermissionsAndroid,
  PermissionsIOS,
  Alert,
  FlatList,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {useAppDispatch, useAppSelector} from 'hooks';
import Icon from 'react-native-vector-icons/Feather';
import {
  AppImages,
  SVGNearbyRestaurant1,
  SVGNearbyRestaurant2,
  SVGNotification,
  SVGPizzBrug,
  SVGPopularItems1,
  SVGPopularItems2,
  SVGPopularItems3,
  SVGPopularItems4,
  SVGSearch,
  SVGSlideOne,
  SVGSlideThree,
  SVGSlideTwo,
} from 'assets/image';

import {ImageComp, Loader} from 'components';
import {getCustomer} from 'store/slices/authSlice';
import Permissions, {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import helpers from 'utils/helpers';
import LocationHeader from 'components/LocationHeader';
import useFetch from 'hooks/useFetch';
import {Supplier} from 'types/supplier';
import {categoryData} from './customer/Categories';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [location, setLocation] = useState<any>(null);
  console.log(location, 'lc');
  const API_KEY = 'AIzaSyBIHlJ75gl-Pl8S4o-jmjdZkrIUp3mvMx4';
  const [lodingLocation, setIsLocationLoading] = useState(false);
  const [address, setAddress] = useState(
    'Behind ganesh temple, New Sangvi, Pune, 411029',
  );
  const [pinCode, setPinCode] = useState('');

  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Snack',
      discount: 40,
      image: <SVGPizzBrug height={100} width={100} />,
    },
    {
      id: 2,
      title: 'Vegetables',
      discount: 30,
      image: <SVGSlideOne height={100} width={100} />,
    },
    {
      id: 3,
      title: 'Dairy Products',
      discount: 50,
      image: <SVGSlideTwo height={100} width={100} />,
    },
    {
      id: 4,
      title: 'Breads',
      discount: 40,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 5,
      title: 'Snacks',
      discount: 50,
      image: <SVGPizzBrug height={100} width={100} />,
    },
    {
      id: 6,
      title: 'Dairy Products',
      discount: 30,
      image: <SVGSlideTwo height={100} width={100} />,
    },
    {
      id: 7,
      title: 'Dairy Products',
      discount: 50,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 8,
      title: 'Snakes',
      discount: 30,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 9,
      title: 'Vegetables',
      discount: 40,
      image: <SVGSlideThree height={100} width={100} />,
    },
  ]);

  const groupedOffers = [];
  for (let i = 0; i < offers.length; i += 3) {
    groupedOffers.push(offers.slice(i, i + 3));
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result === RESULTS.DENIED) {
        const permissionResult = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        return permissionResult === RESULTS.GRANTED;
      }
      return result === RESULTS.GRANTED;
    } else {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.DENIED) {
        const permissionResult = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        return permissionResult === RESULTS.GRANTED;
      }
      return result === RESULTS.GRANTED;
    }
  };
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        console.log(data.results,"ds");
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error(error);
      setAddress('Failed to fetch address');
    }
  };
  const getUserLocation = async () => {
    setIsLocationLoading(true);
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
          fetchAddress(latitude, longitude); // Fetch address here
          setIsLocationLoading(false);

          // Then request a more accurate position
          Geolocation.getCurrentPosition(
            accuratePosition => {
              const {latitude, longitude} = accuratePosition.coords;
              setLocation({latitude, longitude});
              fetchAddress(latitude, longitude); // Fetch address again for more accuracy
            },
            error => console.log(error),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        },
        error => {
          console.log(error);
          Alert.alert('Error', 'Unable to get location');
          setIsLocationLoading(false);
        },
        {enableHighAccuracy: false, timeout: 5000, maximumAge: 60000},
      );
    } else {
      Alert.alert('Permission Denied');
      setIsLocationLoading(false);
    }
  };
  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Api requests
  const {
    data: supplierList,
    error,
    isLoading,
  } = useFetch<Supplier[]>(['supplier'], '/suppliers');

  const {
    data: popularProductsList,

    isLoading: popularLoading,
  } = useFetch<Supplier[]>(['popular_products'], '/products/popular');

  console.log(supplierList, 'SSSSss');

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <Icon name="map-pin" size={18} color="black" />
          <Text style={styles.hederText}>
            {address ? address : 'Add Delivery Location'}
          </Text>
          {/* <LocationHeader navigation={navigation} show /> */}
        </View>
      </>
    );
  };

  const renderCategories = ({item}: any) => {
    const parts = item?.name?.split(' & ');

    return (
      <View style={styles.item}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.itemText}>
          {parts.map((part: string, index: number) => (
            <Text key={index}>
              {part}
              {index < parts.length - 1 && ' &\n'}
            </Text>
          ))}
        </Text>
      </View>
    );
  };

  const renderSellers = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SupplierProduct', {
            supplierId: item.id,
            supplierName: item.companyName,
          })
        }
        style={{alignItems: 'flex-start', marginHorizontal: 10}}>
        <Image
          style={{
            width: 140,
            height: 180,
            resizeMode: 'contain',
            borderRadius: 10,
          }}
          source={{
            uri:
              item?.images?.[0]?.imageUrl ||
              'https://via.placeholder.com/150?text=',
          }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            marginTop: 10,
            textAlign: 'left',
            ...fonts.subHeading,
            fontSize: 12,
            flexShrink: 1,
            flexWrap: 'wrap',
            width: 140,
          }}>
          {item.companyName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBestSellingProducts = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item.id,
          })
        }
        style={{alignItems: 'flex-start', marginHorizontal: 10}}>
        <Image
          style={{
            width: 140,
            height: 180,
            resizeMode: 'contain',
            borderRadius: 10,
          }}
          source={{
            uri: item.imageUrlList?.[0] || 'https://via.placeholder.com/150',
          }}
        />
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            marginTop: 10,
            textAlign: 'left',
            ...fonts.subHeading,
            fontSize: 12,
            flexShrink: 1,
            flexWrap: 'wrap',
            width: 140,
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            marginTop: 5,
            textAlign: 'left',
            // ...fonts.subHeading,
            color: 'black',
            fontSize: 13,
          }}>
          ₹{item?.unitPrice}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        style={styles.searchContainer}>
        <Icon name="search" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search by item or Supplier..."
          placeholderTextColor="#4cb4ff"
          pointerEvents="none"
          editable={false}
          // onChangeText={setSearchText}
          // value={searchText}
        />
      </TouchableOpacity>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {/* Categories list Begin */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={categoryData}
          renderItem={renderCategories}
          keyExtractor={item => item.id}
          horizontal={true}
        />
        {/* Categories list end */}

        {/* Nearby Sellers Begin*/}
        <View>
          <View style={styles.nearbySeller}>
            <Text style={styles.nearBytext}>Nearby Suppliers</Text>
          </View>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={supplierList}
          renderItem={renderSellers}
          keyExtractor={item => item.id}
          horizontal={true}
          contentContainerStyle={{marginBottom: 20}}
        />
        {/* Nearby Sellers end*/}

        {/* Best  Selling Products Begin*/}
        <View style={styles.nearbySeller}>
          <Text style={styles.nearBytext}>Best Selling Products</Text>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={popularProductsList}
          renderItem={renderBestSellingProducts}
          keyExtractor={item => item.id}
          horizontal={true}
          contentContainerStyle={{marginBottom: 20}}
        />
        {/* Best  Selling Products end*/}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      marginBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#4cb4ff',
      borderRadius: 20,
      paddingHorizontal: 10,
      marginTop: 10,
      marginBottom: 10,
      marginHorizontal: 10,
    },
    icon: {
      marginRight: 10,
      color: '#4cb4ff',
    },
    input: {
      flex: 1,
      paddingVertical: 4,
      fontSize: 15,
      color: '#000',
    },
    headerContainer: {
      height: 35,
      borderTopWidth: 1,
      borderTopColor: '#D2D2D2',
      paddingHorizontal: 15,
      gap: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#e9f6ff',
      marginBottom: 5,
    },
    hederText: {color: 'black', fontSize: 14, fontWeight: '600'},
    nearbySeller: {
      marginTop: 5,
      marginBottom: 25,
      flex: 1,
      padding: 7,
      backgroundColor: '#C2E6FF',
      borderRadius: 20,
      textAlign: 'center',
    },
    nearBytext: {
      // ...fonts.bold,
      // ...fonts.subHeading,
      alignSelf: 'center',
      color: '#044171',
      fontSize: 16,
      fontWeight: '600',
    },
    sellerImage: {
      width: 200,
      height: 72,
      borderRadius: 10,
      marginBottom: 10,
    },
    header: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      // paddingVertical: 15,
      paddingBottom: 5,
      alignItems: 'center',
      gap: 11,
    },
    searchWrapper: {
      borderRadius: 26,
      backgroundColor: colors.white,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    item: {
      width: 100,
      marginBottom: 20,
      alignItems: 'center',
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginBottom: 10,
    },
    itemText: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 12,
      textAlign: 'center',
    },

    searchInput: {
      ...fonts.subHeading,
      color: colors.subHeading,
      flex: 1,
      marginHorizontal: 4,
      height: 45,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
      fontSize: 10,
    },
    row: {
      marginTop: 16,
      marginBottom: 32,
    },
    categoryImg: {
      backgroundColor: colors.white,
      borderRadius: 6,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowRadius: 8,
      elevation: 8,
      shadowOpacity: 1,
      flex: 1,
      height: 61,
      width: 61,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      marginRight: 16,
    },
    offerHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 12,
      textAlign: 'center',
    },
    categoryHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
      textAlign: 'center',
    },
    nearRHeading: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
    },
    nearRSubHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
      marginTop: 4,
    },
    content: {
      borderRadius: 30,
      backgroundColor: colors.white,
      padding: 24,
      paddingBottom: 48,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
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
    inputContainerStyle: {
      marginVertical: 8,
    },
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
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    locationContainer: {
      paddingHorizontal: 16,
    },
    locationheader: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 2,
    },
    locationTitle: {
      ...fonts.regular,
      color: colors.white,
      paddingHorizontal: 8,
    },
    locationText: {
      ...fonts.description,
      color: colors.gray,
      lineHeight: 12,
      paddingLeft: 24,
      paddingBottom: 10,
    },
    offerContainer: {
      height: 208,
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
    },
    swipeCard: {
      width: windowWidth - 48,
      padding: 11,
    },
    swipeCardContent: {
      flexDirection: 'row',
      flex: 1,
      marginTop: 10,
    },
    subHeaderContainer: {
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    catalogCard: {
      flex: 1,
      margin: 7,
    },
    catalogTitle: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      paddingTop: 6,
    },
    imgContainer: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {width: 1, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
      borderRadius: 6,
      // borderWidth: 1,
      // borderColor: Colors.CARD_BORDER_COLOR,
      flex: 1,
    },
    nearBySupplierContainer: {
      // backgroundColor: 'red',

      flexDirection: 'row',
      rowGap: 10,
      height: 130,
      marginTop: 10,
    },
  });
