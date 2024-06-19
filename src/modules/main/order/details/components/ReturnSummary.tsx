import {Button, Modal, Portal, Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PagerView from 'react-native-pager-view';
import {CURRENCY_SYMBOLS, RETURN_REASONS} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';
import useFormatNumber from '../../../../../hooks/useFormatNumber';

const ReturnSummary = ({fulfilmentId}: {fulfilmentId: any}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({order}) => order);

  const [itemId, setItemId] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const [reasonId, setReasonId] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fulfillment = orderDetails.fulfillments.find(
      (one: any) => one.id === fulfilmentId,
    );

    const isReturnInitiated =
      fulfillment?.state?.descriptor?.code === 'Return_Initiated';

    const returnTag = fulfillment.tags.find(
      (tag: any) => tag.code === 'return_request',
    );
    const reasonIdTag = returnTag.list.find(
      (tag: any) => tag.code === 'reason_id',
    );
    setReasonId(reasonIdTag.value);
    const imagesTag = returnTag.list.find((tag: any) => tag.code === 'images');
    setImages(imagesTag.value.split(','));

    if (isReturnInitiated) {
      const itemQuantityTag = returnTag.list.find(
        (tag: any) => tag.code === 'item_quantity',
      );
      setQuantity(itemQuantityTag.value);
      const itemTag = returnTag.list.find((tag: any) => tag.code === 'item_id');
      setItemId(itemTag.value);
      setItems(orderDetails.items.filter((item: any) => item.id === itemId));
    } else {
      setItems(
        orderDetails.items.filter(
          (item: any) => item.fulfillment_id === fulfilmentId,
        ),
      );
    }
  }, [orderDetails]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant={'titleMedium'} style={styles.sectionTitle}>
            {t('Return Summary.Items')}
          </Text>
        </View>
        {items.map(item => {
          const cancellable = item?.product['@ondc/org/cancellable'];
          const returnable = item?.product['@ondc/org/returnable'];

          return (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemMeta}>
                <FastImage
                  source={{uri: item?.product?.descriptor?.symbol}}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text variant={'bodyMedium'} style={styles.itemName}>
                      {item?.product?.descriptor?.name}
                    </Text>
                    <Text variant={'labelMedium'} style={styles.quantity}>
                      {t('Return Summary.Qty')} {quantity}
                    </Text>
                    <Text variant={'labelLarge'} style={styles.quantity}>
                      {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                      {formatNumber(
                        Number(quantity * item?.product?.price?.value).toFixed(
                          2,
                        ),
                      )}
                    </Text>
                  </View>
                  <View style={styles.chipContainer}>
                    {cancellable ? (
                      <View style={styles.chip}>
                        <Text variant={'labelMedium'}>
                          {t('Profile.Cancellable')}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.chip}>
                        <Text variant={'labelMedium'}>
                          {t('Profile.Non-cancellable')}
                        </Text>
                      </View>
                    )}
                    {returnable ? (
                      <View style={styles.chip}>
                        <Text variant={'labelMedium'}>
                          {t('Profile.Returnable')}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.chip}>
                        <Text variant={'labelMedium'}>
                          {t('Profile.Non-returnable')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.footer}>
          <Text variant={'labelMedium'} style={styles.reason}>
            {t('Return Summary.Reason')}:{' '}
            {t(
              `Return Reason.${
                RETURN_REASONS.find(one => one.key === reasonId)?.value
              }`,
            )}
          </Text>
          <Button mode={'text'} onPress={showModal}>
            {t('Return Summary.Click to View Images')}
          </Button>
        </View>
        <View style={styles.summaryContainer}>
          {orderDetails?.quote?.breakup
            ?.filter((one: any) => one['@ondc/org/title_type'] !== 'item')
            .map((one: any) => (
              <View key={one?.title} style={styles.summaryRow}>
                <Text variant={'labelMedium'} style={styles.taxName}>
                  {one?.title}
                </Text>
                <Text variant={'labelMedium'} style={styles.taxValue}>
                  {CURRENCY_SYMBOLS[one?.price?.currency]}
                  {formatNumber(one?.price?.value)}
                </Text>
              </View>
            ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.grossTotal}>
          <Text variant={'titleSmall'} style={styles.grossTotalLabel}>
            {t('Return Summary.Order Total')}
          </Text>
          <Text variant={'titleSmall'} style={styles.grossTotalValue}>
            {CURRENCY_SYMBOLS[orderDetails?.quote?.price?.currency]}
            {formatNumber(orderDetails?.quote?.price?.value)}
          </Text>
        </View>
      </View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.modal}>
            <View>
              <View style={styles.closeContainer}>
                <TouchableOpacity onPress={hideModal}>
                  <Icon name={'clear'} size={20} color={'#000'} />
                </TouchableOpacity>
              </View>
              <PagerView style={styles.pager}>
                {images.map(one => (
                  <FastImage source={{uri: one}} style={styles.image} />
                ))}
              </PagerView>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      marginTop: 12,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    footer: {
      paddingTop: 12,
    },
    reason: {
      color: colors.neutral300,
    },
    providerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerImage: {
      width: 30,
      height: 30,
      marginRight: 8,
    },
    sectionTitle: {
      color: colors.neutral400,
    },
    callButton: {
      width: 28,
      height: 28,
      borderWidth: 1,
      borderRadius: 28,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    orderId: {
      marginBottom: 12,
    },
    item: {
      paddingVertical: 12,
      borderBottomColor: colors.neutral100,
      borderBottomWidth: 1,
    },
    itemImage: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 10,
      backgroundColor: colors.neutral100,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    itemDetails: {
      flex: 1,
    },
    itemHeader: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chipContainer: {
      flexDirection: 'row',
    },
    returnItem: {
      borderRadius: 8,
      marginTop: 12,
      borderColor: colors.primary,
    },
    chip: {
      marginRight: 4,
      backgroundColor: colors.neutral100,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 22,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemName: {
      marginBottom: 4,
    },
    quantity: {
      color: colors.neutral300,
    },
    summaryContainer: {
      marginTop: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    taxName: {
      color: colors.neutral400,
    },
    taxValue: {
      color: colors.neutral400,
      fontWeight: '700',
    },
    divider: {
      marginVertical: 20,
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
    grossTotal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    grossTotalLabel: {
      color: colors.neutral400,
    },
    grossTotalValue: {
      color: colors.primary,
    },
    closeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 16,
    },
    pager: {
      width: '100%',
      height: 300,
    },
    image: {
      width: 205,
      height: 205,
    },
    modal: {
      backgroundColor: colors.white,
      margin: 20,
      borderRadius: 24,
    },
  });

export default ReturnSummary;
