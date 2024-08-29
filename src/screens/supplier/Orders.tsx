import {useAppSelector} from 'hooks';
import useFetch from 'hooks/useFetch';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';

const CompletedOrders = ({navigation}) => {
  const {supplierData} = useAppSelector(state => state.auth);
  const {
    data: ordersList,
    error,
    isLoading,
  } = useFetch<any[]>(
    ['supplier-cart', supplierData?.id],
    `/suppliers/${supplierData?.id}/carts`,
    false,
  );

  // Filter the orders to show only those with status 'COMPLETED'
  const completedOrders =
    ordersList?.filter(order => order.status === 'ACCEPTED') || [];
  function truncate(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }

  const renderItem = ({item}) => (
    <Pressable
      onPress={() =>
        navigation.navigate('CompletedOrdersDetailScreen', {
          order: item,
        })
      }
      style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSide}>
          <Text style={styles.name}>{item?.customer?.fullName}</Text>
          <Text style={styles.orderId}>{`Order ID: ${truncate(
            item.orderId ?? '',
            23,
          )}`}</Text>
          <Text style={styles.date}>Date : {item?.date}</Text>
        </View>
        <View style={styles.rightSide}>
          <Text style={styles.qty}>{`Qty: ${item?.items?.length}`}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.heading}>Completed</Text>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error loading orders</Text>
        ) : (
          <FlatList
            data={completedOrders}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#f0f0f0', // Optional: background color for the outer container
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#44aafc', // Blue background
    textAlign: 'center',
    paddingVertical: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // borderRadius: 10,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Shadow for the container
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: -10, // Make sure container overlaps heading border radius
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10, // Adjust vertical padding if needed
  },
  card: {
    width: Dimensions.get('window').width - 60, // Adjusted width to fit within the container
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // Shadow for the card
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderId: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  date: {
    fontSize: 14,
    color: '#007BFF', // Blue color for the date
    marginVertical: 4,
  },
  qty: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompletedOrders;
