import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, BILLING_ADDRESS} from '../../../../utils/apiUtilities';
import {skeletonList} from '../../../../utils/utils';
import AddressCard from '../addressPicker/AddressCard';
import AddressCardSkeleton from '../addressPicker/AddressCardSkeleton';
import Header from '../addressPicker/Header';

/**
 * Component to render list of address
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const BillingAddressPicker = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const {t} = useTranslation();
  const [list, setList] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const isFocused = useIsFocused();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const {selectedAddress} = params;

  /**
   * function handles click event of add billing address button
   */
  const onAdd = () => {
    navigation.navigate('AddAddress', {selectedAddress: selectedAddress});
  };

  /**
   * function to get list of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${BILLING_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setList(data);
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
    navigation.navigate('AddressPicker', {
      billingAddress: selectedBillingAddress,
    });
  };

  /**
   * Function is used to render single address card in the list
   * @param item: single object from address list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const onEdit = () => {
      navigation.navigate('AddAddress', {
        selectedAddress: selectedAddress,
        item: item,
      });
    };
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <AddressCardSkeleton item={item} />
    ) : (
      <AddressCard
        item={item}
        selectedAddress={selectedBillingAddress}
        setSelectedAddress={setSelectedBillingAddress}
        onEdit={onEdit}
      />
    );
  };

  useEffect(() => {
    if (isFocused) {
      setSelectedBillingAddress(null);
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
        <Header
          title={t('main.cart.billing_address')}
          show={selectedAddress}
          navigation={navigation}
        />
        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return (
              <TouchableOpacity
                style={[styles.button, {borderColor: colors.accentColor}]}
                onPress={onAdd}>
                <Text style={{color: colors.accentColor}}>
                  {t('main.cart.add_billing_address')}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
        />

        {selectedBillingAddress !== null && (
          <View style={styles.buttonContainer}>
            <ContainButton
              title={t('main.cart.save')}
              onPress={onPressHandler}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(BillingAddressPicker);
const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginVertical: 10,
    alignSelf: 'center',
  },
  contentContainerStyle: {paddingHorizontal: 10, paddingBottom: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
