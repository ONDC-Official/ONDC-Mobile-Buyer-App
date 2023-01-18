import {postData} from '../../../utils/api';
import {
  CANCEL_ORDER,
  GET_STATUS,
  SERVER_URL,
  TRACK_ORDER,
} from '../../../utils/apiUtilities';
import {alertWithOneButton} from '../../../utils/alerts';
import i18n from '../../../locales/i18next';

/**
 * function used to request tracking details of order
 * @returns {Promise<void>}
 */
export const trackOrder = async (
  setTrackInProgress,
  setTrackMessageId,
  order,
  options,
) => {
  try {
    setTrackInProgress(true);
    const payload = [
      {
        context: {
          transaction_id: order.transactionId,
          bpp_id: order.bppId,
        },
        message: {order_id: order.id},
      },
    ];
    const {data} = await postData(
      `${SERVER_URL}${TRACK_ORDER}`,
      payload,
      options,
    );

    if (data[0].message.ack.status === 'ACK') {
      setTrackMessageId(data[0].context.message_id);
    }
  } catch (e) {
    throw e;
  }
};

/**
 * function used to request cancel order
 * @returns {Promise<void>}
 */
export const cancelOrder = async (
  setCancelInProgress,
  setCancelMessageId,
  order,
  id,
  options,
) => {
  try {
    setCancelInProgress(true);
    const payload = {
      context: {
        bpp_id: order.bppId,
        transaction_id: order.transactionId,
      },
      message: {order_id: order.id, cancellation_reason_id: id},
    };
    const {data} = await postData(
      `${SERVER_URL}${CANCEL_ORDER}`,
      payload,
      options,
    );
    setCancelMessageId(data.context.message_id);
  } catch (e) {
    throw e;
  }
};

export const getStatus = async (
  setStatusInProgress,
  setStatusMessageId,
  order,
  options,
) => {
  try {
    setStatusInProgress(true);
    const payload = [
      {
        context: {
          bpp_id: order.bppId,
          transaction_id: order.transactionId,
        },
        message: {order_id: order.id},
      },
    ];
    const {data} = await postData(
      `${SERVER_URL}${GET_STATUS}`,
      payload,
      options,
    );
    if (data[0]?.message?.ack?.status === 'ACK') {
      setStatusMessageId(data[0].context.message_id);
    } else {
      alertWithOneButton(
        'Unable to Call',
        'Unable to place your call currently, please try again',
        'Ok',
        () => {},
      );
    }
  } catch (e) {
    throw e;
  }
};
