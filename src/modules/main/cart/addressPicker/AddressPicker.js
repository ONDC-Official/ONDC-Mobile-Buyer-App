import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, GET_ADDRESS} from '../../../../utils/apiUtilities';
import {skeletonList} from '../../../../utils/utils';
import AddressCard from './AddressCard';
import AddressCardSkeleton from './AddressCardSkeleton';
import Header from './Header';

const buttonTitle = strings('main.cart.next');
const selectAddress = strings('main.cart.select_address_title');
const emptyListMessage = strings('main.order.list_empty_message');

/**
 * Component to render list of address
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const AddressPicker = ({navigation, theme}) => {
  const {colors} = theme;
  const [list, setList] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const isFocused = useIsFocused();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  /**
   * function to get list of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setList(data);
      console.log(data);
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

  /**
   * function handles click event of next button
   */
  const onPressHandler = () => {
    navigation.navigate('BillingAddressPicker', {selectedAddress});
  };

  /**
   * Function is used to render single address card in the list
   * @param item: single object from address list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const onEdit = () => {
      navigation.navigate('AddAddress', {
        selectedAddress: 'address',
        item: item,
      });
    };
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <AddressCardSkeleton item={item} />
    ) : (
      <AddressCard
        item={item}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        onEdit={onEdit}
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

  const listData = list ? list : skeletonList;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <View
        style={[
          appStyles.container,
          {backgroundColor: colors.backgroundColor},
        ]}>
        <Header title={selectAddress} show="address" navigation={navigation} />

        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text>{emptyListMessage}</Text>;
          }}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
        />

        {selectedAddress !== null && (
          <View style={styles.buttonContainer}>
            <ContainButton title={buttonTitle} onPress={onPressHandler} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(AddressPicker);
const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginVertical: 10,
    alignSelf: 'center',
  },
  contentContainerStyle: {paddingHorizontal: 10, paddingBottom: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
});
