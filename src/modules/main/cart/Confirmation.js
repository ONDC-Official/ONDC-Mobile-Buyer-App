import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Card, Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import ContainButton from '../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {BASE_URL, GET_QUOTE, ON_GET_QUOTE} from '../../../utils/apiUtilities';
import {maskAmount, showToastWithGravity, skeletonList,} from '../../../utils/utils';
import Header from '../cart/addressPicker/Header';
import ConfirmationCardSkeleton from './ConfirmationCardSkeleton';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;
  const {
    state: {token},
  } = useContext(AuthContext);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [confirmationList, setConfirmationList] = useState(null);
  const [total, setTotal] = useState(null);
  const [fulfillment, setFulFillment] = useState(null);

  const onGetQuote = messageId => {
    const messageIds = messageId.toString();
    let getConfirmation = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_GET_QUOTE}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        let list = [];
        data.forEach(item => {
          if (!item.error) {
            if (item.context.bpp_id) {
              item.message.quote.items.forEach(element => {
                const object = cartItems.find(one => one.id === element.id);
                element.provider = {
                  id: object.provider_details.id,
                  descriptor: object.provider_details.descriptor,
                  locations: [object.location_details.id],
                };
                setTotal(item.message.quote.quote.price.value);
                const breakupItem = item.message.quote.quote.breakup.find(
                  one => one.title === 'FULFILLMENT',
                );
                breakupItem
                  ? setFulFillment(breakupItem.price.value)
                  : setFulFillment(null);
                element.transaction_id = item.context.transaction_id;
                element.bpp_id = item.context.bpp_id;
                list.push(element);
              });
            }
          }
        });

        setConfirmationList(list);
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(getConfirmation);
    }, 14000);
  };

  const getQuote = async () => {
    try {
      let payload = [];
      let providerIdArray = [];
      cartItems.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider_details.id,
        );
        if (index > -1) {
          let itemObj = {
            id: item.id,
            product: {
              id: item.id,
              descriptor: item.descriptor,
              price: item.price,
              provider_name: item.provider_details.descriptor.name,
            },
            quantity: {
              count: item.quantity,
            },
            bpp_id: item.bpp_details.bpp_id,
            provider: {
              id: item.provider_details.id,
              locations: [item.location_details.id],
            },
          };
          payload[index].message.cart.items.push(itemObj);
        } else {
          let payloadObj = {
            context: {transaction_id: item.transaction_id},
            message: {
              cart: {
                items: [
                  {
                    id: item.id,
                    product: {
                      id: item.id,
                      descriptor: item.descriptor,
                      price: item.price,
                      provider_name: item.provider_details.descriptor.name,
                    },
                    quantity: {
                      count: item.quantity,
                    },
                    bpp_id: item.bpp_details.bpp_id,
                    provider: {
                      id: item.provider_details.id,
                      locations: [item.location_details.id],
                    },
                  },
                ],
              },
            },
          };
          payload.push(payloadObj);
          providerIdArray.push(item.provider_details.id);
        }
      });
      const {data} = await postData(`${BASE_URL}${GET_QUOTE}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        if (item.message.ack.status === 'ACK') {
          messageIds.push(item.context.message_id);
        }
      });
      if (messageIds.length > 0) {
        onGetQuote(messageIds);
      } else {
        showToastWithGravity(strings('network_error.something_went_wrong'));
        setConfirmationList([]);
      }
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  useEffect(() => {
    getQuote()
      .then(() => {})
      .catch(() => {});
  }, []);

  const renderItem = ({item}) => {
    const element = cartItems.find(one => one.id === item.id);
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ConfirmationCardSkeleton item={item}/>
    ) : (
      <>
        {element ? (
          <Card containerStyle={styles.card}>
            <View style={styles.subContainer}>
              <FastImage
                source={{
                  uri: element.descriptor.images
                    ? element.descriptor.images[0]
                    : null,
                }}
                style={styles.image}
                resizeMode={'contain'}
              />
              <View style={appStyles.container}>
                <Text style={styles.title} numberOfLines={1}>
                  {element.descriptor.name ? element.descriptor.name : null}
                </Text>
                <View style={styles.organizationNameContainer}>
                  <Text numberOfLines={1}>
                    {element.provider_details
                      ? element.provider_details.descriptor.name
                      : null}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text>
                    {element.price.value} X {element.quantity}
                  </Text>

                  <Text>₹ {element.price.value * element.quantity}</Text>
                </View>
              </View>
            </View>
          </Card>
        ) : null}
      </>
    );
  };

  const listData = confirmationList ? confirmationList : skeletonList;
  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title="Order Confirmation" navigation={navigation}/>

        <FlatList
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          data={listData}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyListComponent}>
                <Text>No data found</Text>
              </View>
            );
          }}
        />
        {total && (
          <Card containerStyle={styles.card}>
            {fulfillment && (
              <>
                <View style={styles.priceContainer}>
                  <Text style={styles.fulfillment}>FULFILLMENT</Text>
                  <Text style={styles.fulfillment}>₹{fulfillment}</Text>
                </View>
                <Divider/>
              </>
            )}
            <View style={styles.priceContainer}>
              <Text style={styles.title}>Total Payable </Text>
              <Text style={styles.title}>₹{maskAmount(total)}</Text>
            </View>
          </Card>
        )}
        {confirmationList && confirmationList.length > 0 && (
          <View style={styles.buttonContainer}>
            <ContainButton
              title="Proceed"
              onPress={() =>
                navigation.navigate('Payment', {
                  selectedAddress: params.selectedAddress,
                  confirmationList: confirmationList,
                })
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
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
  title: {fontSize: 18, marginTop: 10, fontWeight: '600'},
  buttonContainer: {width: 300, padding: 20, alignSelf: 'center'},
  totalContainer: {paddingHorizontal: 10},
  emptyListComponent: {alignItems: 'center', justifyContent: 'center'},
  quantityContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  fulfillment: {fontSize: 16, fontWeight: '600', marginBottom: 10},
});
