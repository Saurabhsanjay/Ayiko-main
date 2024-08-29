import {useAuth} from 'contexts/AuthContext';
import PrivateScreen from 'contexts/AuthScreen';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AccountItem = ({icon, title, onPress}) => (
  <TouchableOpacity style={styles.accountItem} onPress={onPress}>
    <View style={styles.accountItemLeft}>
      <Icon name={icon} size={24} color="#4cb4ff" />
      <Text style={styles.accountItemText}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#4A4A4A" />
  </TouchableOpacity>
);

const AccountPage = ({navigation}) => {
  const accountItems = [
    {icon: 'phone', title: 'Help Centre'},
    {icon: 'globe', title: 'Language'},
    {icon: 'user-check', title: 'Membership'},
    {icon: 'credit-card', title: 'Payment Method'},
    {icon: 'map-pin', title: 'Your Addresses'},
    {icon: 'package', title: 'My Orders'},
    {icon: 'shield', title: 'Privacy Policy And Setting'},
    {icon: 'log-out', title: 'Logout'},
  ];
  const {user} = useAuth();

  console.log(user, 'logged user toke n');

  if (!user) {
    return <PrivateScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileLeft}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Eddie Shala</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="chevron-right" size={24} color="#4A4A4A" />
        </TouchableOpacity>
      </View>

      <View style={styles.accountList}>
        {accountItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <AccountItem
              icon={item.icon}
              title={item.title}
              onPress={() => console.log(`Pressed ${item.title}`)}
            />
            {index < accountItems.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountList: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 54,
  },
});

export default AccountPage;
