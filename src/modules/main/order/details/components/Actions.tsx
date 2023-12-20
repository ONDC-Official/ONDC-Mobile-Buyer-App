import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  isItemCustomization,
  showToastWithGravity,
} from '../../../../../utils/utils';
import axios from 'axios';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {ORDER_STATUS} from '../../../../../utils/apiActions';
import GetStatusButton from './GetStatusButton';
import TrackOrderButton from './TrackOrderButton';

interface Actions {
  orderDetails: any;
  onUpdateOrder: (value: any) => void;
  onUpdateTrackingDetails: (value: any) => void;
}

const CancelToken = axios.CancelToken;
const Actions: React.FC<Actions> = ({orderDetails, onUpdateOrder, onUpdateTrackingDetails}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [isIssueRaised, setIsIssueRaised] = useState<boolean>(false);
  const [issueLoading, setIssueLoading] = useState<boolean>(false);
  const [trackOrderLoading, setTrackOrderLoading] = useState<boolean>(false);
  const [showIssueModal, setShowIssueModal] = useState<boolean>(false);
  const [showCancelOrderModal, setShowCancelOrderModal] =
    useState<boolean>(false);
  const [showReturnOrderModal, setShowReturnOrderModal] =
    useState<boolean>(false);
  const [allNonCancellable, setAllNonCancellable] = useState<boolean>(false);
  const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);
  const [itemQuotes, setItemQuotes] = useState<any>(null);
  const [deliveryQuotes, setDeliveryQuotes] = useState<any>(null);
  const [cancelledItems, setCancelledItems] = useState<any[]>([]);
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [returnOrCancelledItems, setReturnOrCancelledItems] = useState<any[]>(
    [],
  );
  const statusEventSourceResponseRef = useRef<any>(null);
  const source = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();

  const navigateToTickets = () => {};

  const getReturnOrCancelledItems = () => {
    let items: any[] = [];
    orderDetails?.fulfillments?.forEach((fulfilment: any) => {
      if (fulfilment.type === 'Return') {
        const details = fulfilment.tags[0].list;
        let id, quantity;
        details.forEach((one: any) => {
          if (one.code === 'item_id') {
            id = one.value;
          }
          if (one.code === 'item_quantity') {
            quantity = one.value;
          }
        });
        items.push({
          id,
          quantity,
          type: fulfilment.type,
          status: fulfilment.state.descriptor.code,
        });
      }
    });
    return items;
  };

  const areAllItemsNonCancellable = (products: any[]) => {
    return !products.some((obj: any) => obj['@ondc/org/cancellable']);
  };

  const generateProductsList = (details: any) => {
    return details?.items
      ?.map(({id}: {id: number}, index: number) => {
        let findQuote = details.updatedQuote?.breakup.find(
          (item: any) =>
            item['@ondc/org/item_id'] === id &&
            item['@ondc/org/title_type'] === 'item',
        );
        if (findQuote) {
          if (findQuote?.item?.tags) {
            const tag = findQuote.item.tags.find(
              (tag: any) => tag.code === 'type',
            );
            const tagList = tag?.list;
            const type = tagList?.find((item: any) => item.code === 'type');
            if (type?.value === 'item') {
              const parentId = findQuote?.item?.parent_item_id;
              return {
                id,
                name: findQuote?.title ?? 'NA',
                cancellation_status:
                  details.items?.[index]?.cancellation_status ?? '',
                return_status: details.items?.[index]?.return_status ?? '',
                fulfillment_status:
                  details.items?.[index]?.fulfillment_status ?? '',
                ...details.items?.[index]?.product,
                parent_item_id: parentId,
                provider_details: details.provider,
              };
            }
          } else {
            const parentId = findQuote?.item?.parent_item_id;
            return {
              id,
              name: findQuote?.title ?? 'NA',
              cancellation_status:
                details.items?.[index]?.cancellation_status ?? '',
              return_status: details.items?.[index]?.return_status ?? '',
              fulfillment_status:
                details.items?.[index]?.fulfillment_status ?? '',
              customizations: null,
              ...details.items?.[index]?.product,
              parent_item_id: parentId,
              provider_details: details.provider,
            };
          }
        }
        return null;
      })
      .filter((item: any) => item !== null);
  };

  useEffect(() => {
    try {
      if (orderDetails) {
        if (orderDetails.updatedQuote) {
          const provided_by = orderDetails?.provider?.descriptor?.name;
          let uuid = 0;
          const breakup = orderDetails.updatedQuote.breakup;
          const all_items = breakup?.map((breakUpItem: any) => {
            const items = orderDetails.items;
            const itemIndex = items.findIndex(
              (one: any) => one.id === breakUpItem['@ondc/org/item_id'],
            );
            const item = itemIndex > -1 ? items[itemIndex] : null;
            let itemQuantity = item ? item?.quantity?.count : 0;
            let quantity = breakUpItem['@ondc/org/item_quantity']
              ? breakUpItem['@ondc/org/item_quantity'].count
              : 0;
            let textClass = '';
            let quantityMessage = '';
            if (quantity === 0) {
              if (breakUpItem['@ondc/org/title_type'] === 'item') {
                textClass = 'text-error';
                quantityMessage = 'Out of stock';

                if (itemIndex > -1) {
                  items.splice(itemIndex, 1);
                }
              }
            } else if (quantity !== itemQuantity) {
              textClass =
                breakUpItem['@ondc/org/title_type'] === 'item'
                  ? 'text-amber'
                  : '';
              quantityMessage = `Quantity: ${quantity}/${itemQuantity}`;
              if (item) {
                item.quantity.count = quantity;
              }
            } else {
              quantityMessage = `Quantity: ${quantity}`;
            }
            uuid = uuid + 1;
            return {
              id: breakUpItem['@ondc/org/item_id'],
              title: breakUpItem?.title,
              title_type: breakUpItem['@ondc/org/title_type'],
              isCustomization: isItemCustomization(breakUpItem?.item?.tags),
              isDelivery: breakUpItem['@ondc/org/title_type'] === 'delivery',
              parent_item_id: breakUpItem?.item?.parent_item_id,
              price: Number(breakUpItem.price?.value)?.toFixed(2),
              itemQuantity,
              quantity,
              provided_by,
              textClass,
              quantityMessage,
              uuid: uuid,
              fulfillment_status: item?.fulfillment_status,
              cancellation_status: item?.cancellation_status,
              return_status: item?.return_status,
              isCancellable: item?.product?.['@ondc/org/cancellable'],
              isReturnable: item?.product?.['@ondc/org/returnable'],
            };
          });
          let items: any = {};
          let delivery: any = {};
          let selected_fulfillment_id = orderDetails?.items[0]?.fulfillment_id;
          all_items.forEach((item: any) => {
            setQuoteItemInProcessing(item.id);
            // for type item
            if (item.title_type === 'item' && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              let price: any = {
                title: item.quantity + ' * Base Price',
                value: item.price,
              };
              let prev_item_data = items[key];
              let addition_item_data: any = {title: item.title, price: price};
              addition_item_data.isCancellable = item.isCancellable;
              addition_item_data.isReturnable = item.isReturnable;
              addition_item_data.fulfillment_status = item?.fulfillment_status;
              if (item?.return_status) {
                addition_item_data.return_status = item?.return_status;
              } else {
              }
              if (item?.cancellation_status) {
                addition_item_data.cancellation_status =
                  item?.cancellation_status;
              } else {
              }
              items[key] = {...prev_item_data, ...addition_item_data};
            }
            if (
              item.title_type === 'tax' &&
              !item.isCustomization &&
              item.id !== selected_fulfillment_id
            ) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key].tax = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === 'discount' && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key].discount = {
                title: item.title,
                value: item.price,
              };
            }

            //for customizations
            if (item.title_type === 'item' && item.isCustomization) {
              let key = item.parent_item_id;
              items[key].customizations = items[key].customizations || {};
              let existing_data = items[key].customizations[item.id] || {};
              let customisation_details = {
                title: item.title,
                price: {
                  title: item.quantity + ' * Base Price',
                  value: item.price,
                },
                quantityMessage: item.quantityMessage,
                textClass: item.textClass,
                quantity: item.quantity,
                cartQuantity: item.cartQuantity,
              };
              items[key].customizations[item.id] = {
                ...existing_data,
                ...customisation_details,
              };
            }
            if (item.title_type === 'tax' && item.isCustomization) {
              let key = item.parent_item_id;
              items[key].customizations = items[key].customizations || {};
              items[key].customizations[item.id] =
                items[key].customizations[item.id] || {};
              items[key].customizations[item.id].tax = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === 'discount' && item.isCustomization) {
              let key = item.parent_item_id;
              items[key].customizations = items[key].customizations || {};
              items[key].customizations[item.id] =
                items[key].customizations[item.id] || {};
              items[key].customizations[item.id].discount = {
                title: item.title,
                value: item.price,
              };
            }
            //for delivery
            if (item.title_type === 'delivery') {
              delivery.delivery = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === 'discount_f') {
              delivery.discount = {
                title: item.title,
                value: item.price,
              };
            }
            if (
              (item.title_type === 'tax_f' || item.title_type === 'tax') &&
              item.id === selected_fulfillment_id
            ) {
              delivery.tax = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === 'packing') {
              delivery.packing = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === 'discount') {
              if (!item.isCustomization) {
                let id = item.id;
                items[id].discount = {
                  title: item.title,
                  value: item.price,
                };
              }
            }
            if (item.title_type === 'misc') {
              delivery.misc = {
                title: item.title,
                value: item.price,
              };
            }
          });
          setQuoteItemInProcessing(null);
          setItemQuotes(items);
          setDeliveryQuotes(delivery);
        }
        if (orderDetails.items && orderDetails.items.length > 0) {
          const filterCancelledItems: any[] = [];
          const filterReturnItems: any[] = [];

          orderDetails.items.forEach((item: any) => {
            if (
              item.cancellation_status &&
              item.cancellation_status === 'Cancelled'
            ) {
              filterCancelledItems.push(item);
            }

            if (
              item.cancellation_status &&
              item.cancellation_status !== 'Cancelled'
            ) {
              filterReturnItems.push(item);
            }
          });
          setCancelledItems(filterCancelledItems);
          setReturnItems(filterReturnItems);
        }
        setReturnOrCancelledItems(getReturnOrCancelledItems());
        const list = generateProductsList(orderDetails);
        setAllNonCancellable(areAllItemsNonCancellable(list));
      }
    } catch (error) {
      console.log(error);
      let msg: string = quoteItemInProcessing
        ? `Looks like Quote mapping for item: ${quoteItemInProcessing} is invalid! Please check!`
        : 'Seems like issue with quote processing! Please confirm first if quote is valid!';
      showToastWithGravity(msg);
    }
  }, [orderDetails]);

  return (
    <>
      {orderDetails?.state === 'Completed' ? (
        <View style={styles.buttonContainer}>
          {isIssueRaised ? (
            <Button
              mode="outlined"
              icon={() =>
                issueLoading ? (
                  <ActivityIndicator size={14} color={theme.colors.primary} />
                ) : (
                  <></>
                )
              }
              disabled={trackOrderLoading || statusLoading || issueLoading}
              onPress={navigateToTickets}>
              Track Issue
            </Button>
          ) : (
            <Button
              mode="outlined"
              icon={() =>
                issueLoading ? (
                  <ActivityIndicator size={14} color={theme.colors.primary} />
                ) : (
                  <></>
                )
              }
              disabled={trackOrderLoading || statusLoading || issueLoading}
              onPress={() => setShowIssueModal(true)}>
              Raise Issue
            </Button>
          )}
          <Button
            mode="contained"
            onPress={() => setShowReturnOrderModal(true)}
            disabled={statusLoading || trackOrderLoading}>
            Return Order
          </Button>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <GetStatusButton
            orderDetails={orderDetails}
            statusLoading={statusLoading}
            setStatusLoading={setStatusLoading}
            onUpdateOrder={onUpdateOrder}
          />
          <TrackOrderButton
            orderDetails={orderDetails}
            trackOrderLoading={trackOrderLoading}
            statusLoading={statusLoading}
            setTrackOrderLoading={setTrackOrderLoading}
            onUpdateTrackingDetails={onUpdateTrackingDetails}
          />
          {(orderDetails?.state === 'Accepted' ||
            orderDetails?.state === 'Created') && (
            <Button
              mode="contained"
              onPress={() => setShowCancelOrderModal(true)}
              disabled={
                allNonCancellable || statusLoading || trackOrderLoading
              }>
              Cancel Order
            </Button>
          )}
        </View>
      )}
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });

export default Actions;
