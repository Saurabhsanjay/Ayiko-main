import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {catalogList, catalogUpdate} from 'store/slices/catalogSlice';
import {RootState} from 'store';
import {ImageComp, Loader} from 'components';

const windowWidth = Dimensions.get('window').width;

const CatalogScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [popOverId, setPopOverId] = useState<string | null>(null);
  const [changeStatus, setChangeStatus] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const isLoading = useAppSelector((state: RootState) => state.catalog.loading);
  const catalogData = useAppSelector((state: RootState) => state.catalog.data);
  const {supplierData} = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (supplierData?.id) {
      dispatch(catalogList(supplierData.id));
    }
  }, [supplierData?.id, dispatch]);

  const onClose = () => {
    setPopOverId(null);
  };

  const onOpen = (id: string) => {
    setPopOverId(id);
  };

  const openChangeStatusPopup = (item: any) => {
    setSelectedItem(item);
    setIsAvailable(item.available);
    setChangeStatus(true);
  };

  const closeChangeStatusPopup = () => {
    setChangeStatus(false);
    setSelectedItem(null);
  };

  const updateItemStatus = () => {
    if (selectedItem) {
      const updatedItem = {...selectedItem, available: isAvailable};
      dispatch(catalogUpdate(updatedItem));
      closeChangeStatusPopup();
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <View
        style={[
          styles.card,
          {marginBottom: catalogData?.length === index + 1 ? 150 : 8},
        ]}
        key={index}>
        <ImageComp
          source={{uri: item?.imageUrl[0]?.imageUrl}}
          imageStyle={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.available}>
            {item.available ? 'In Stock' : 'Out Of Stock'}
          </Text>
          <Text style={styles.unitPrice}>
            {item.unitPrice}/{item.category}
          </Text>
        </View>
        <Popover
          isVisible={item.id === popOverId}
          onRequestClose={onClose}
          placement={PopoverPlacement.BOTTOM}
          from={
            <TouchableOpacity onPress={() => onOpen(item.id)}>
              <Feather name="more-vertical" size={25} />
            </TouchableOpacity>
          }>
          <View style={styles.popoverContainer}>
            <TouchableOpacity
              style={styles.popoverContent}
              onPress={() => {
                onClose();
                navigation.navigate('NewCatalogScreen', {
                  catalogData: item,
                });
              }}>
              <Feather name="edit-2" />
              <Text style={styles.popoverText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverContent}
              onPress={() => {
                onClose();
                openChangeStatusPopup(item);
              }}>
              <Feather name="refresh-cw" />
              <Text style={styles.popoverText}>Change Status</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    );
  };

  const renderChangeStatusModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={changeStatus}
        onRequestClose={closeChangeStatusPopup}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeChangeStatusPopup}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Status</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </Text>
              <Switch
                value={isAvailable}
                onValueChange={value => setIsAvailable(value)}
                trackColor={{false: colors.gray, true: colors.primary}}
                thumbColor={isAvailable ? colors.white : colors.lightGray}
              />
            </View>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={updateItemStatus}>
              <Text style={styles.updateButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      <Pressable
        onPress={() => navigation.navigate('NewCatalogScreen')}
        style={styles.createButton}>
        <View style={styles.leftContent}>
          <View style={styles.plusIconContainer}>
            <Icon name="plus" size={20} color="#007AFF" />
          </View>
          <Text style={styles.buttonTextCatalog}>Create Catalog</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#007AFF" />
      </Pressable>
      <View style={styles.listContainer}>
        {catalogData && catalogData.length > 0 && (
          <Text style={styles.heading}>Catalog List</Text>
        )}
        <FlatList
          style={styles.flatList}
          data={catalogData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      {renderChangeStatusModal()}
    </SafeAreaView>
  );
};

export default CatalogScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
    },
    flatList: {
      paddingHorizontal: 10,
    },
    heading: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 10,
      marginHorizontal: 20,
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
    buttonTextCatalog: {
      color: '#007AFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    card: {
      flexDirection: 'row',
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      padding: 11,
      marginBottom: 8,
    },
    image: {
      borderRadius: 8,
      width: 70,
      height: 70,
    },
    cardContent: {
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
    unitPrice: {
      ...fonts.description,
      color: colors.subHeading,
    },
    popoverContainer: {
      padding: 10,
    },
    popoverContent: {
      flexDirection: 'row',
      padding: 7,
      alignItems: 'center',
      gap: 10,
    },
    popoverText: {
      ...fonts.regular,
      color: colors.text,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: windowWidth - 40,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    switchLabel: {
      marginRight: 10,
      fontSize: 16,
      color: colors.text,
    },
    updateButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    updateButtonText: {
      color: 'white',
      fontSize: 16,
      // fontWeight: 'bold',
    },
  });
