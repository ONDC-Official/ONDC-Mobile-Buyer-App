import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CartContext} from '../../../context/Cart';
import {getData, postData} from '../../../utils/api';
import {Context as AuthContext} from '../../../context/Auth';
import {BASE_URL, GET_QUOTE, ON_GET_QUOTE} from '../../../utils/apiUtilities';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {Card, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {appStyles} from '../../../styles/styles';
import Header from '../cart/addressPicker/Header';
import ContainButton from '../../../components/button/ContainButton';
import {skeletonList} from '../../../utils/utils';
import ProductCardSkeleton from '../product/ProductCardSkeleton';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;
  const {cart} = useContext(CartContext);
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [confirmationList, setConfirmationList] = useState(null);

  const onGetQuote = messageId => {
    const messageIds = messageId.toString();
    let getConfirmation = setInterval(async () => {
      try {
        const response = await getData(
          `${BASE_URL}${ON_GET_QUOTE}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        let list = [];
        response.data.forEach(item => {
          item.message.quote.items.forEach(element => {
            element.provider = item.message.quote.provider
              ? item.message.quote.provider.id
              : null;
            element.images = item.message.quote.provider
              ? item.message.quote.provider.descriptor.images
              : null;
            element.transaction_id = item.context.transaction_id;
            element.bpp_id = item.context.bpp_id;
            list.push(element);
          });
        });
        setConfirmationList(list);
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(getConfirmation);
    }, 10000);
  };

  const getQuote = async () => {
    try {
      let payload = [];
      let bppIdArray = [];
      cart.forEach(item => {
        const index = bppIdArray.findIndex(one => one === item.bpp_id);
        if (index > -1) {
          let itemObj = {
            id: item.id,
            quantity: {
              count: item.quantity,
            },
            bpp_id: item.bpp_id,
            provider: {
              id: item.provider_id,
              //   locations: location,
            },
          };
          payload[index].message.cart.items.push(itemObj);
        } else {
          let payloadObj = {
            context: {},
            message: {
              cart: {
                items: [
                  {
                    id: item.id,
                    quantity: {
                      count: item.quantity,
                    },
                    bpp_id: item.bpp_id,
                    provider: {
                      id: item.provider_id,
                      //   locations: location,
                    },
                  },
                ],
              },
            },
          };
          payload.push(payloadObj);
          bppIdArray.push(item.bpp_id);
        }
      });
      const {data} = await postData(`${BASE_URL}${GET_QUOTE}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        messageIds.push(item.context.message_id);
      });
      onGetQuote(messageIds);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  const renderItem = ({item}) => {
    const element = cart.find(one => one.id === item.id);
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <Card containerStyle={styles.card}>
        <View style={styles.subContainer}>
          <FastImage
            source={{uri: element ? element.descriptor.images[0] : null}}
            style={styles.image}
            resizeMode={'contain'}
          />
          <View style={appStyles.container}>
            <Text style={styles.title} numberOfLines={1}>
              {element.descriptor.name ? element.descriptor.name : null}
            </Text>
            <View style={styles.organizationNameContainer}>
              <Text numberOfLines={1}>
                {element.provider ? element.provider : null}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text>₹ {item.price.value * item.quantity.selected.count}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const listData = confirmationList ? confirmationList : skeletonList;
  return (
    <View style={appStyles.container}>
      <Header title="Order Confirmation" navigation={navigation} />

      <FlatList
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        data={listData}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />

      <View style={styles.buttonContainer}>
        <ContainButton
          title="Proceed"
          onPress={() =>
            navigation.navigate('Payment', {
              selectedAddress: params.selectedAddress,
              confirmationList: confirmationList,
            })
          }
          disabled={!confirmationList}
        />
      </View>
    </View>
  );
};

export default withTheme(Confirmation);

const styles = StyleSheet.create({
  card: {marginTop: 15, borderRadius: 8, elevation: 6},
  subContainer: {flexDirection: 'row'},
  image: {height: 80, width: 80, marginRight: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainerStyle: {paddingBottom: 10},
  organizationNameContainer: {marginTop: 4, marginBottom: 8},
  title: {fontSize: 18, fontWeight: '600'},
  buttonContainer: {width: 300, padding: 20, alignSelf: 'center'},
});
