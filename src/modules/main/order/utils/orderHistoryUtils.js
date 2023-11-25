import {postData} from '../../../../utils/api';
import {BASE_URL, CANCEL_ORDER} from '../../../../utils/apiUtilities';

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
      `${BASE_URL}${CANCEL_ORDER}`,
      payload,
      options,
    );
    setCancelMessageId(data.context.message_id);
  } catch (e) {
    throw e;
  }
};
