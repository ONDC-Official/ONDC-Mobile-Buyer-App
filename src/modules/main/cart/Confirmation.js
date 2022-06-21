import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Card, Divider, Text, withTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import ContainButton from '../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {BASE_URL, GET_QUOTE, ON_GET_QUOTE} from '../../../utils/apiUtilities';
import {
  maskAmount,
  showToastWithGravity,
  skeletonList,
} from '../../../utils/utils';
import Header from '../cart/addressPicker/Header';
import ProductCard from '../product/list/component/ProductCard';
import ProductCardSkeleton from '../product/list/component/ProductCardSkeleton';

const Confirmation = ({theme, navigation, route: {params}}) => {
  const {
    state: {token},
  } = useContext(AuthContext);

  const {t} = useTranslation();

  const {transactionId} = useSelector(({filterReducer}) => filterReducer);

  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [confirmationList, setConfirmationList] = useState(null);

  const [total, setTotal] = useState(null);

  const [fulfillment, setFulFillment] = useState(null);

  const [apiInProgress, setApiInProgress] = useState(false);

  const {colors} = theme;

  /**
   * function request  order confirmation
   * @param messageId:array of message id's
   * @returns {Promise<void>}
   */
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
                const object = cartItems.find(one => one.id == element.id);
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
      setApiInProgress(false);
    }, 12000);
  };

  /**
   * function request  order confirmation
   * @returns {Promise<void>}
   */
  const getQuote = async () => {
    try {
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
            product: {
              id: item.id,
              descriptor: item.descriptor,
              price: item.price,
              provider_name: item.provider_details.descriptor.name,
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
            context: {transaction_id: transactionId},
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
                      locations: [item.location_id],
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
      const fulfillmentMissingItem = data.find(
        item => !item.message.hasOwnProperty('ack'),
      );
      let messageIds = [];
      if (!fulfillmentMissingItem) {
        data.forEach(item => {
          if (item.message.ack.status === 'ACK') {
            messageIds.push(item.context.message_id);
          }
        });
        if (messageIds.length > 0) {
          onGetQuote(messageIds);
        } else {
          setConfirmationList([]);
          setApiInProgress(false);
        }
      } else {
        showToastWithGravity(fulfillmentMissingItem.message);
        setConfirmationList([]);
        setApiInProgress(false);
      }
    } catch (error) {
      handleApiError(error);
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

  const renderItem = ({item}) => {
    const element = cartItems.find(one => one.id == item.id);

    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : element ? (
      <ProductCard item={element} navigation={navigation} cancellable={true} />
    ) : null;
  };

  const listData =
    confirmationList && !apiInProgress ? confirmationList : skeletonList;

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={t('main.cart.update_cart')} navigation={navigation} />

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
                <Text>{t('main.order.list_empty_message')}</Text>
              </View>
            );
          }}
        />
        {total && !apiInProgress && (
          <Card containerStyle={styles.card}>
            {fulfillment && (
              <>
                <View style={styles.priceContainer}>
                  <Text style={styles.fulfillment}>
                    {t('main.cart.fulfillment')}
                  </Text>
                  <Text style={styles.fulfillment}>₹{fulfillment}</Text>
                </View>
                <Divider style={styles.divider} />
              </>
            )}
            <View style={styles.priceContainer}>
              <Text style={styles.title}>{t('main.cart.sub_total_label')}</Text>
              <Text style={styles.title}>₹{maskAmount(total)}</Text>
            </View>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          {confirmationList && confirmationList.length > 0 && !apiInProgress ? (
            <ContainButton
              title={t('main.cart.proceed_to_pay')}
              onPress={() =>
                navigation.navigate('Payment', {
                  selectedAddress: params.selectedAddress,
                  selectedBillingAddress: params.selectedBillingAddress,
                  confirmationList: confirmationList,
                })
              }
            />
          ) : (
            <>
              {apiInProgress && (
                <ActivityIndicator
                  color={colors.accentColor}
                  style={styles.activityindicator}
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
  activityindicator: {paddingVertical: 10},
});
