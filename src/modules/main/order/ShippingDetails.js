import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import StepIndicator from 'react-native-step-indicator';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../locales/i18n';
import {getData, postData} from '../../../utils/api';
import {
  BASE_URL,
  CANCEL_ORDER,
  ON_CANCEL_ORDER,
  ON_TRACK_ORDER,
  TRACK_ORDER,
} from '../../../utils/apiUtilities';
import {FAQS, ORDER_STATUS} from '../../../utils/Constants';
import {showToastWithGravity} from '../../../utils/utils';

const deliveryTo = strings('main.order.delivery_to_label');
const statusLabel = strings('main.order.status_label');
const returnLabel = strings('main.order.return');
const cancel = strings('main.order.cancel');

const labels = ['Ordered', 'Shipped', 'Delivered'];

const customStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 60,
  separatorStrokeWidth: 5,
  currentStepStrokeWidth: 7,
  stepStrokeCurrentColor: '#ffff',
  stepStrokeWidth: 0,
  stepStrokeFinishedColor: '#ffff',
  stepStrokeUnFinishedColor: '#ffff',
  separatorFinishedColor: '#30B086',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#ffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: '#30B086',
  stepIndicatorLabelFinishedColor: '#30B086',
  stepIndicatorLabelUnFinishedColor: '#30B086',
  labelColor: '#999999',
  labelSize: 16,
  currentStepLabelColor: '#30B086',
};

const ShippingDetails = ({item, getOrderList, theme}) => {
  const {colors} = theme;
  const separator = ',';
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [currentPosition, setCurrentPosition] = useState(0);
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [trackInProgress, setTrackInProgress] = useState(false);

  const setPosition = () => {
    if (item.state === 'PENDING-CONFIRMATION') {
      setCurrentPosition(0);
    } else if (item.state === 'shipped') {
      setCurrentPosition(1);
    } else {
      setCurrentPosition(2);
    }
  };

  const trackOrder = async () => {
    try {
      setTrackInProgress(true);
      const payload = [
        {
          context: {
            transaction_id: item.transactionId,
            bpp_id: item.bppId,
          },
          message: {order_id: item.id},
        },
      ];
      const {data} = await postData(
        `${BASE_URL}${TRACK_ORDER}`,
        payload,
        options,
      );
      if (data[0].message.ack.status === 'ACK') {
        const response = await getData(
          `${BASE_URL}${ON_TRACK_ORDER}messageIds=${data[0].context.message_id}`,
          options,
        );
        if (response.data[0].message.tracking.status === 'active') {
          const supported = await Linking.canOpenURL(FAQS);
          if (supported) {
            await Linking.openURL(FAQS);
          }
        }
      }
      setTrackInProgress(false);
    } catch (e) {
      handleApiError(e);
      setTrackInProgress(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setCancelInProgress(true);
      const payload = {
        context: {
          bpp_id: item.bppId,
          transaction_id: item.transactionId,
        },
        message: {order_id: item.id, cancellation_reason_id: 'item'},
      };
      const {data} = await postData(
        `${BASE_URL}${CANCEL_ORDER}`,
        payload,
        options,
      );

      const response = await getData(
        `${BASE_URL}${ON_CANCEL_ORDER}messageId=${data.context.message_id}`,
        options,
      );
      if (response.data.hasOwnProperty('message')) {
        getOrderList(1)
          .then(() => {})
          .catch(() => {});
      } else {
        showToastWithGravity('Something went wrong!');
      }
      setCancelInProgress(false);
    } catch (e) {
      handleApiError(e);
      setCancelInProgress(false);
    }
  };

  const setColor = position =>
    position <= currentPosition ? '#30B086' : '#aaaaaa';

  useEffect(() => {
    setPosition();
  }, []);

  return (
    <>
      <View style={styles.addressContainer}>
        <Text style={{color: colors.grey}}>{deliveryTo}</Text>

        <Text>
          {item.billing.address.building ? item.billing.address.building : null}
          {item.billing.address.building ? separator : null}{' '}
          {item.billing.address.street}, {item.billing.address.city}{' '}
          {item.billing.address.state}
        </Text>

        <Text style={{color: colors.grey}}>
          {item.billing.address.area_code}
        </Text>
      </View>

      <View>
        <>
          <Text style={{color: colors.grey}}>{statusLabel}</Text>
          {item.state !== ORDER_STATUS.CANCELLED ? (
            <>
              <StepIndicator
                currentPosition={currentPosition}
                stepCount={labels.length}
                customStyles={customStyles}
                renderStepIndicator={({position}) => {
                  return (
                    <View
                      style={[
                        styles.stepIndicator,
                        {backgroundColor: setColor(position)},
                      ]}
                    />
                  );
                }}
                labels={labels}
                renderLabel={({position, label}) => {
                  return (
                    <Text style={{color: setColor(position)}}>{label}</Text>
                  );
                }}
              />
              <View>
                <View style={styles.container}>
                  {item.state === ORDER_STATUS.DELIVERED ? (
                    <TouchableOpacity
                      style={[
                        styles.clearCartButton,
                        {borderColor: colors.grey},
                      ]}>
                      <Text style={[styles.text, {color: colors.grey}]}>
                        {returnLabel}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.clearCartButton,
                        {borderColor: colors.grey},
                      ]}
                      onPress={() => {
                        trackOrder()
                          .then(() => {})
                          .catch(() => {});
                      }}>
                      <Text style={[styles.text, {color: colors.grey}]}>
                        Track
                      </Text>
                      {trackInProgress && (
                        <ActivityIndicator
                          showLoading={trackInProgress}
                          color={colors.black}
                          size={14}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  <View style={styles.space} />
                  <TouchableOpacity
                    style={[
                      styles.clearCartButton,
                      {borderColor: colors.accentColor},
                    ]}
                    onPress={cancelOrder}>
                    <Text style={[styles.text, {color: colors.accentColor}]}>
                      {cancel}
                    </Text>
                    {cancelInProgress && (
                      <ActivityIndicator
                        showLoading={cancelInProgress}
                        color={colors.accentColor}
                        size={14}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View
              style={[
                styles.cancelledButton,
                {
                  borderColor: colors.error,
                  backgroundColor: colors.cancelledBackground,
                },
              ]}
              onPress={cancelOrder}>
              <Text style={[styles.text, {color: colors.error}]}>
                Cancelled
              </Text>
            </View>
          )}
        </>
      </View>
    </>
  );
};

export default withTheme(ShippingDetails);

const styles = StyleSheet.create({
  addressContainer: {marginVertical: 20},
  text: {fontSize: 16, marginRight: 5},
  container: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clearCartButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  space: {margin: 10},
  stepIndicator: {width: 20, height: 20, borderRadius: 50},
  cancelledButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
});
