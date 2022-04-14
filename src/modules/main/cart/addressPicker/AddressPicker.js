import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, GET_ADDRESS} from '../../../../utils/apiUtilities';
import AddressCard from './AddressCard';
import Header from './Header';

const AddressPicker = ({navigation, theme}) => {
  const {colors} = theme;
  const [list, setList] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const {
    state: {token},
  } = useContext(AuthContext);

  const getAddressList = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setList(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <AddressCard
        item={item}
        index={index}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    );
  };

  useEffect(() => {
    getAddressList();
  }, []);

  return (
    <View style={[appStyles.container, {backgroundColor: colors.white}]}>
      <Header title="Select delivery address" show navigation={navigation} />
      {list !== null && (
        <FlatList
          data={list}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
      <View style={styles.buttonContainer}>
        <ContainButton title="Next" />
      </View>
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
});
