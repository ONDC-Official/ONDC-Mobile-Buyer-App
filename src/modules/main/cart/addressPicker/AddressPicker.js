import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {withTheme, Text} from 'react-native-elements';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, GET_ADDRESS} from '../../../../utils/apiUtilities';
import AddressCard from './AddressCard';
import Header from './Header';

const AddressPicker = ({navigation, theme}) => {
  const {colors} = theme;
  const [list, setList] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const isFocused = useIsFocused();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  const getAddressList = async () => {
    try {
      console.log(token);
      const {data} = await getData(`${BASE_URL}${GET_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      let newList = [];
      data.forEach(element => {
        element.id = Math.random().toString();
        newList.push(element);
      });
      setList(newList);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setList([]);
        } else {
          handleApiError(error);
        }
      }
    }
  };

  const onPressHandler = () => {
    navigation.navigate('Payment', {selectedAddress});
  };

  const renderItem = ({item, index}) => {
    return (
      <AddressCard
        item={item}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    );
  };

  useEffect(() => {
    if (isFocused) {
      getAddressList()
        .then(() => {})
        .catch(() => {});
    }
  }, [isFocused]);

  return (
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header title="Select delivery address" show navigation={navigation} />
      {list !== null && (
        <FlatList
          data={list}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text>No address found. Please add the address</Text>;
          }}
          contentContainerStyle={
            list.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
        />
      )}
      {selectedAddress !== null && (
        <View style={styles.buttonContainer}>
          <ContainButton title="Next" onPress={onPressHandler} />
        </View>
      )}
    </View>
  );
};

export default withTheme(AddressPicker);
const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  contentContainerStyle: {padding: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
});
