import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ProductItem = ({item}) => (
  <View style={styles.productItem}>
    <Image
      source={{
        uri:
          item?.product?.imageUrl?.[0]?.imageUrl ||
          'https://via.placeholder.com/100',
      }}
      style={styles.productImage}
    />
    <Text style={styles.productName}>
      {item?.product?.name?.charAt(0)?.toUpperCase() +
        item?.product?.name?.slice(1)}
    </Text>
    <Text style={styles.productQuantity}>
      {item.quantity} {item?.product?.category}
    </Text>
    <Text
      style={[
        styles.productStock,
        item?.product?.available ? styles.inStock : styles.outOfStock,
      ]}>
      {item?.product?.available ? 'In Stock' : 'Out of Stock'}
    </Text>
  </View>
);

const CompletedOrderDetails = ({route}) => {
  const {order} = route.params || {};
  const totalPrice = order?.items?.reduce((acc, item) => {
    return acc + parseFloat(item.product.unitPrice) * item.quantity;
  }, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.name}>{order?.customer?.fullName}</Text>

        <View style={styles.row}>
          <Icon name="map-pin" size={16} color="#666" style={styles.icon} />
          <View style={styles.column}>
            <Text style={styles.label}>Delivery Address:</Text>
            <Text style={styles.value}>
              {order?.deliveryAddress?.addressLine1},{' '}
              {order?.deliveryAddress?.addressLine2}
              {order?.deliveryAddress?.addressLine2 ? ',' : ''}{' '}
              {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state},{' '}
              {order?.deliveryAddress?.country},{' '}
              {order?.deliveryAddress?.postalCode},{' '}
              {order?.deliveryAddress?.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="list" size={16} color="#666" style={styles.icon} />
          <View style={styles.column}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>#{order?.id}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.name}>Order Details</Text>
      </View>
      <FlatList
        data={order?.items}
        renderItem={ProductItem}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.billDetails}>
        <Text style={styles.billDetailsTitle}>Billing Details</Text>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Subtotal</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Promocode</Text>
          <Text style={styles.billingValue}>0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Delivery Fee</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Tax & other Fee</Text>
          <Text style={styles.billingValue}>Rs. 0</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.billingRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rs. {totalPrice}</Text>
        </View>
      </View>
      <View style={styles.outerContainer}>
        <View style={styles.infoBox}>
          <View style={styles.rows}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.image}
            />
            <Text style={styles.text}>Delivered by: John Doe</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CompletedOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    // marginBottom: 20,
    paddingBottom: 20,
  },
  orderDetails: {
    paddingHorizontal: 10,
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
    marginVertical: 20,
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 20,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    // backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    marginVertical: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#454545',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  column: {
    flex: 1, // Take up remaining space in the row
  },
  icon: {
    marginRight: 8,
    marginTop: 3, // Align icon with text baseline
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    flexWrap: 'wrap',
  },
  //   productList: {
  //     padding: 8,
  //   },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  productQuantity: {
    fontSize: 13,
    marginBottom: 3,
  },
  productStock: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
  },
  billDetails: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  billDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
  },
  billingValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF', // You can change this color to match your app's theme
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  approveButton: {
    backgroundColor: '#0fc300', // Green color for approve
  },
  rejectButton: {
    backgroundColor: '#fe0000', // Red color for reject
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
