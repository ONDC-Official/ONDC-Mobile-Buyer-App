import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Card, Text, withTheme} from 'react-native-paper';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData, postData} from '../../../../utils/api';
import {
  GET_SELECT,
  ON_GET_SELECT,
  SERVER_URL,
} from '../../../../utils/apiUtilities';
import {
  maskAmount,
  showToastWithGravity,
  skeletonList,
} from '../../../../utils/utils';
import ProductCard from '../../product/list/component/ProductCard';
import ProductCardSkeleton from '../../product/list/component/ProductCardSkeleton';
import Header from '../addressPicker/Header';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const {t} = useTranslation();
  const {transactionId} = useSelector(({filterReducer}) => filterReducer);
  const {latitude, longitude, pinCode} = useSelector(
    ({locationReducer}) => locationReducer,
  );
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const confirmation = useRef(null);
  const [messageIds, setMessageIds] = useState(null);
  const total = useRef(null);
  const [apiInProgress, setApiInProgress] = useState(false);
  const {colors} = theme;

  /**
   * function request  order confirmation
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onGetQuote = async id => {
    try {
      setApiInProgress(true);

      const {data} = await getData(
        `${SERVER_URL}${ON_GET_SELECT}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!data[0].error) {
        if (data[0].context.bpp_id) {
          data[0].message.quote.items.forEach(element => {
            const object = cartItems.find(one => one.id == element.id);
            if (object) {
              element.provider = {
                id: object.provider_details.id,
                descriptor: object.provider_details.descriptor,
                locations: [object.location_details.id],
              };
              element.transaction_id = data[0].context.transaction_id;
              element.bpp_id = data[0].context.bpp_id;
              if (confirmation.current) {
                let newArray = confirmation.current;
                newArray.push(element);
                confirmation.current = newArray;
              } else {
                let newArray = [];
                newArray.push(element);
                confirmation.current = newArray;
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
          let itemObj = {
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
          };
          payload[index].message.cart.items.push(itemObj);
        } else {
          let payloadObj = {
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
                        gps: `${latitude},${longitude}`,

                        address: {
                          area_code: `${pinCode}`,
                        },
                      },
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

      const {data} = await postData(`${SERVER_URL}${GET_SELECT}`, payload, {
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
        .catch(() => {});
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
          `${SERVER_URL}/clientApis/events?messageId=${messageId}`,
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
            .catch(() => {});
        });
      });
    }

    return () => {
      removeEvent(eventSources);
      clearTimeout(timer);
    };
  }, [messageIds]);

  const renderItem = ({item}) => {
    const element = confirmation.current
      ? confirmation.current.find(one => one.id == item.id)
      : null;

    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <ProductCard
        item={item}
        navigation={navigation}
        cancellable
        confirmed={element}
        apiInProgress={apiInProgress}
      />
    );
  };

  const listData = !apiInProgress ? cartItems : skeletonList;

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={'Update Cart'} navigation={navigation} />

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
        {total.current && !apiInProgress && (
          <Card containerStyle={styles.card}>
            <View style={styles.priceContainer}>
              <Text style={styles.title}>Subtotal:</Text>
              <Text style={styles.title}>₹{maskAmount(total.current)}</Text>
            </View>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          {confirmation.current &&
          confirmation.current.length > 0 &&
          !apiInProgress ? (
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate('Payment', {
                  selectedAddress: params.selectedAddress,
                  selectedBillingAddress: params.selectedBillingAddress,
                  confirmationList: confirmation.current,
                })
              }>
              Proceed to Pay
            </Button>
          ) : (
            <>
              {apiInProgress && (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.activityIndicator}
                  size={26}
                />
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Confirmation);

const styles = StyleSheet.create({
  card: {marginTop: 10, marginHorizontal: 10, borderRadius: 8, elevation: 6},
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
  buttonContainer: {width: 300, paddingVertical: 20, alignSelf: 'center'},
  totalContainer: {paddingHorizontal: 10},
  emptyListComponent: {alignItems: 'center', justifyContent: 'center'},
  quantityContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  divider: {marginBottom: 10},
  fulfillment: {fontSize: 16, fontWeight: '600', marginBottom: 10},
  activityIndicator: {paddingVertical: 10},
});
