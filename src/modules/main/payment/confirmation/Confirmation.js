import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text, withTheme} from 'react-native-paper';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData, postData} from '../../../../utils/api';
import {
  BASE_URL,
  GET_SELECT,
  ON_GET_SELECT,
} from '../../../../utils/apiUtilities';
import {
  showToastWithGravity,
  skeletonList,
  stringToDecimal,
} from '../../../../utils/utils';
import ProductCardSkeleton from '../../product/list/component/ProductCardSkeleton';
import Product from './Product';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const {transactionId} = useSelector(({filterReducer}) => filterReducer);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const {handleApiError} = useNetworkErrorHandling();
  const confirmation = useRef(null);
  const total = useRef(null);

  const [messageIds, setMessageIds] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function request  order confirmation
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onGetQuote = async id => {
    try {
      setApiInProgress(true);

      const {data} = await getData(
        `${BASE_URL}${ON_GET_SELECT}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!data[0].error) {
        if (data[0].context.bpp_id) {
          data[0].message.quote.items.forEach(element => {
            const product = cartItems.find(one => one.id === element.id);
            const productPrice = data[0].message.quote.quote.breakup.find(
              one => one['@ondc/org/item_id'] === product.id,
            );

            const cost = product.price.value
              ? product.price.value
              : product.price.maximum_value;

            if (
              stringToDecimal(productPrice.price.value) !==
              stringToDecimal(cost)
            ) {
              element.message = 'Price of this product has been updated';
            }
            if (product) {
              element.provider = {
                id: product.provider_details.id,
                descriptor: product.provider_details.descriptor,
                locations: [product.location_details.id],
              };
              element.fulfillment = data[0].message.quote.fulfillments.find(
                one => one.id === element.fulfillment_id,
              );
              element.transaction_id = data[0].context.transaction_id;
              element.bpp_id = data[0].context.bpp_id;
              if (confirmation.current) {
                confirmation.current.push(element);
              } else {
                confirmation.current = [element];
              }
            }
          });

          total.current = total.current
            ? total.current + Number(data[0].message.quote.quote.price.value)
            : Number(data[0].message.quote.quote.price.value);
        }
        setApiInProgress(1);
        const ids = confirmation.current.map(one => one.id);
        const isAllPresent = cartItems.every(one => ids.includes(one.id));
        isAllPresent ? setApiInProgress(false) : setApiInProgress(true);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * function request  order confirmation
   * @returns {Promise<void>}
   */
  const getQuote = async () => {
    try {
      total.current = null;
      confirmation.current = null;
      setApiInProgress(true);
      let payload = [];
      let providerIdArray = [];
      cartItems.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider_details.id,
        );
        if (index > -1) {
          payload[index].message.cart.items.push({
            id: item.id,
            quantity: {
              count: item.quantity,
            },
            product: item,
            bpp_id: item.bpp_details.bpp_id,
            provider: {
              id: item.provider_details.id,
              locations: [item.location_details.id],
            },
          });
        } else {
          payload.push({
            context: {
              transaction_id: transactionId,
              city: item.city,
              state: item.state,
            },
            message: {
              cart: {
                items: [
                  {
                    id: item.id,
                    product: item,
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
                fulfillments: [
                  {
                    end: {
                      location: {
                        gps: params.deliveryAddress.gps,
                        address: {
                          area_code: params.deliveryAddress.address.areaCode,
                        },
                      },
                    },
                  },
                ],
              },
            },
          });
          providerIdArray.push(item.provider_details.id);
        }
      });

      const {data} = await postData(`${BASE_URL}${GET_SELECT}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const fulfillmentMissingItem = data.find(
        item => !item.message.hasOwnProperty('ack'),
      );
      let messageIdArray = [];
      if (!fulfillmentMissingItem) {
        data.forEach(item => {
          if (item.message.ack.status === 'ACK') {
            messageIdArray.push(item.context.message_id);
          }
        });
        if (messageIdArray.length > 0) {
          setMessageIds(messageIdArray);
        } else {
          confirmation.current = [];
          setApiInProgress(false);
        }
      } else {
        showToastWithGravity(fulfillmentMissingItem.message);
        confirmation.current = [];

        setApiInProgress(false);
      }
    } catch (error) {
      console.log(error);
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  const removeEvent = eventSources => {
    if (eventSources) {
      eventSources.forEach(eventSource => {
        eventSource.removeAllListeners();
        eventSource.close();
      });
      eventSources = null;
      setApiInProgress(false);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      getQuote()
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    } else {
      navigation.navigate('Dashboard', {screen: 'Cart'});
    }
  }, [cartItems]);

  useEffect(() => {
    let eventSources = null;
    let timer = null;
    if (messageIds) {
      eventSources = messageIds.map(messageId => {
        return new RNEventSource(
          `${BASE_URL}/clientApis/events?messageId=${messageId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      });
      if (!timer) {
        timer = setTimeout(removeEvent, 20000, eventSources);
      }
      eventSources.forEach(eventSource => {
        eventSource.addEventListener('on_select', event => {
          const data = JSON.parse(event.data);
          onGetQuote(data.messageId)
            .then(() => {})
            .catch(error => {
              console.log(error);
            });
        });
      });
    }

    return () => {
      removeEvent(eventSources);
      clearTimeout(timer);
    };
  }, [messageIds]);

  const renderItem = ({item}) => {
    let element = null;

    if (confirmation.current) {
      element = confirmation.current.find(one => one.id === item.id);
    }

    return item.hasOwnProperty('isSkeleton') ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <Product
        item={item}
        navigation={navigation}
        confirmation={element}
        apiInProgress={apiInProgress}
      />
    );
  };

  const listData = apiInProgress ? skeletonList : cartItems;

  return (
    <View style={appStyles.container}>
      <FlatList
        style={appStyles.container}
        keyExtractor={item => item.id}
        data={listData}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => (
          <View style={styles.emptyListComponent}>
            <Text>No data found</Text>
          </View>
        )}
      />

      {apiInProgress ? (
        <></>
      ) : (
        <View style={[styles.footer, {backgroundColor: theme.colors.footer}]}>
          <View style={appStyles.container}>
            {total.current && (
              <>
                <Text>Subtotal</Text>
                <Text style={styles.totalAmount}>₹{total.current}</Text>
              </>
            )}
          </View>
          <View style={appStyles.container}>
            {confirmation.current && confirmation.current.length > 0 && (
              <Button
                mode="contained"
                contentStyle={appStyles.containedButtonContainer}
                labelStyle={appStyles.containedButtonLabel}
                onPress={() =>
                  navigation.navigate('Payment', {
                    deliveryAddress: params.deliveryAddress,
                    billingAddress: params.billingAddress,
                    confirmationList: confirmation.current,
                  })
                }>
                Checkout
              </Button>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default withTheme(Confirmation);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 10},
  emptyListComponent: {alignItems: 'center', justifyContent: 'center'},
  footer: {
    padding: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
