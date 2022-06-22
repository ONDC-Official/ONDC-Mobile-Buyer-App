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
import {BASE_URL, GET_ADDRESS} from '../../../../utils/apiUtilities';
import {skeletonList} from '../../../../utils/utils';
import AddressCard from './AddressCard';
import AddressCardSkeleton from './AddressCardSkeleton';
import Header from './Header';

/**
 * Component to render list of address
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddressPicker = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const [list, setList] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [billingAddress, setBillingAdrress] = useState(null);

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
    navigation.navigate('Confirmation', {
      selectedAddress,
      selectedBillingAddress: billingAddress,
    });
  };

  /**
   * function handles click event of next button
   */
  const onEditHandler = () => {
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
        params={params}
        setBillingAdrress={setBillingAdrress}
        onEdit={onEdit}
      />
    );
  };

  useEffect(() => {
    if (isFocused) {
      setBillingAdrress(null);
      setSelectedAddress(null);
      getAddressList()
        .then(() => {})
        .catch(() => {});
      params
        ? setBillingAdrress(params.billingAddress)
        : setBillingAdrress(selectedAddress);
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
          title={t('main.cart.select_address_title')}
          show="address"
          navigation={navigation}
        />

        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text>{t('main.order.list_empty_message')}</Text>;
          }}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
        />

        {billingAddress !== null && (
          <View style={[styles.container, {backgroundColor: colors.white}]}>
            <Text style={styles.name}>{t('main.cart.billing_address')}</Text>
            <View style={styles.subContainer}>
              <View style={styles.title}>
                <Text style={styles.address}>
                  {billingAddress.descriptor
                    ? billingAddress.descriptor.name
                    : billingAddress.name}
                </Text>

                <Text style={[styles.text, {color: colors.grey}]}>
                  {billingAddress.descriptor
                    ? billingAddress.descriptor.email
                    : billingAddress.email}
                </Text>

                <Text style={[styles.text, {color: colors.grey}]}>
                  {billingAddress.descriptor
                    ? billingAddress.descriptor.phone
                    : billingAddress.phone}
                </Text>

                <Text style={[styles.address, {color: colors.grey}]}>
                  {billingAddress.address.street} {billingAddress.address.city}{' '}
                  {billingAddress.address.state}
                </Text>
                <Text style={{color: colors.grey}}>
                  {billingAddress.address.areaCode}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.button, {borderColor: colors.accentColor}]}
                onPress={onEditHandler}>
                <Text style={{color: colors.accentColor}}>
                  {t('main.cart.edit')}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedAddress !== null && (
              <View style={styles.buttonContainer}>
                <ContainButton
                  title={t('main.cart.next')}
                  onPress={onPressHandler}
                />
              </View>
            )}
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
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    margin: 0,
    elevation: 4,
    marginTop: 15,
    borderRadius: 8,
    padding: 0,
  },
  textContainer: {flexShrink: 1, flexDirection: 'row'},
  name: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
  },
  text: {marginBottom: 4},
  address: {textTransform: 'capitalize', marginBottom: 4},

  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  title: {marginRight: 5},
  containerStyle: {borderRadius: 8, margin: 10},
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 15,
  },
});
