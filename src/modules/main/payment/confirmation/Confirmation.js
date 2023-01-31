import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Card, Divider, Text, withTheme} from 'react-native-paper';
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
import Product from './components/Product';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const {transactionId} = useSelector(({filterReducer}) => filterReducer);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const {handleApiError} = useNetworkErrorHandling();
  const confirmation = useRef([]);
  const availableProducts = useRef([]);
  const totalAmount = useRef(0);
  const [total, setTotal] = useState(0);

  const [providers, setProviders] = useState([]);
  const [messageIds, setMessageIds] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function request  order confirmation
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onGetQuote = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_GET_SELECT}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      const quoteData = data[0];
      if (!quoteData.error) {
        if (quoteData.context.bpp_id) {
          const providerList = providers.concat([]);
          const provider = providerList.find(
            one => one.provider.id === quoteData.message.quote.provider.id,
          );
          quoteData.message.quote.items.forEach(element => {
            const product = provider.items.find(
              one => String(one.id) === String(element.id),
            );

            if (product) {
              const productPrice = quoteData.message.quote.quote.breakup.find(
                one =>
                  one['@ondc/org/item_id'] === String(product.id) &&
                  one['@ondc/org/title_type'] === 'item',
              );

              const cost = product.price.value
                ? product.price.value
                : product.price.maximum_value;

              if (
                stringToDecimal(productPrice?.item?.price?.value) !==
                stringToDecimal(cost)
              ) {
                element.message = 'Price of this product has been updated';
              }

              element.provider = {
                id: product.provider_details.id,
                descriptor: product.provider_details.descriptor,
                locations: [product.location_details.id],
              };
              element.transaction_id = quoteData.context.transaction_id;
              element.bpp_id = quoteData.context.bpp_id;
              element.bpp_uri = quoteData.context.bpp_uri;
              availableProducts.current.push(element.id);
              const providerIndex = confirmation.current.findIndex(
                one => one.providerId === quoteData.message.quote.provider.id,
              );
              if (providerIndex > -1) {
                confirmation.current[providerIndex].items.push(element);
              } else {
                confirmation.current.push({
                  items: [element],
                  providerId: quoteData.message.quote.provider.id,
                  fulfillments: quoteData.message.quote.fulfillments,
                });
              }

              quoteData.message.quote.quote.breakup.forEach(breakup => {
                if (breakup['@ondc/org/item_id'] === String(product.id)) {
                  if (breakup['@ondc/org/title_type'] !== 'item') {
                    if (product.hasOwnProperty('knowCharges')) {
                      product.knowCharges.push(breakup);
                    } else {
                      product.knowCharges = [breakup];
                    }
                  }
                } else if (breakup['@ondc/org/title_type'] !== 'item') {
                  if (provider.hasOwnProperty('additionCharges')) {
                    if (
                      provider.additionCharges.findIndex(
                        one =>
                          one['@ondc/org/item_id'] ===
                            breakup['@ondc/org/item_id'] &&
                          one.title === breakup.title,
                      ) < 0
                    ) {
                      provider.additionCharges.push(breakup);
                    }
                  } else {
                    provider.additionCharges = [breakup];
                  }
                }
              });
              product.dataReceived = true;
              product.confirmation = element;
            }
          });
          setProviders(providerList);
          totalAmount.current =
            totalAmount.current +
            Number(quoteData.message.quote.quote.price.value);
          setTotal(totalAmount.current);
        }
        const isAllPresent = cartItems.every(one =>
          availableProducts.current?.includes(one.id),
        );
        isAllPresent ? setApiInProgress(false) : setApiInProgress(true);
      }
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  /**
   * function request  order confirmation
   * @returns {Promise<void>}
   */
  const getQuote = async () => {
    try {
      setApiInProgress(true);
      totalAmount.current = 0;
      setTotal(0);
      confirmation.current = [];
      availableProducts.current = [];
      let payload = [];
      let providerIdArray = [];
      let confirmationProducts = [];
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
          confirmationProducts[index].items.push(item);
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
          confirmationProducts.push({
            provider: item.provider_details,
            items: [item],
          });
        }
      });
      setProviders(confirmationProducts);

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
          availableProducts.current = [];
          setApiInProgress(false);
        }
      } else {
        showToastWithGravity(fulfillmentMissingItem.message);
        confirmation.current = [];
        availableProducts.current = [];
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
      const list = providers.concat([]);
      list.forEach(provider => {
        provider.items?.forEach(one => {
          if (!one.hasOwnProperty('dataReceived')) {
            one.dataReceived = false;
          }
        });
      });
      setProviders(list);
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
      timer = setTimeout(removeEvent, 20000, eventSources);
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
    return item.hasOwnProperty('isSkeleton') ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <View style={styles.providerContainer}>
        <Text variant="titleMedium" style={{paddingHorizontal: 12}}>
          {item?.provider?.descriptor?.name}
        </Text>
        <Card style={styles.cardContainer}>
          {item?.items.map(one => (
            <Product
              key={`${one.id}Product`}
              item={one}
              navigation={navigation}
            />
          ))}
          {item?.additionCharges && item.additionCharges.length > 0 && (
            <>
              <Divider bold />
              {item?.additionCharges?.map((charge, index) => (
                <View key={`${index}Charge`} style={styles.priceContainer}>
                  <Text variant="titleSmall" style={styles.title}>
                    {charge?.title}
                  </Text>
                  <Text
                    style={{color: theme.colors.opposite}}
                    variant="titleMedium">
                    ₹{stringToDecimal(charge?.price?.value)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </Card>
        <Divider bold />
      </View>
    );
  };

  const listData = apiInProgress ? skeletonList : providers;
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
            <Text>Subtotal</Text>
            <Text style={styles.totalAmount}>₹{total}</Text>
          </View>
          <View style={appStyles.container}>
            {availableProducts.current.length === cartItems.length && (
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
  providerContainer: {
    paddingVertical: 10,
  },
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
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  cardContainer: {
    margin: 8,
    padding: 8,
    backgroundColor: 'white',
  },
});
