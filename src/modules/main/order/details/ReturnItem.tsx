import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Menu, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import React, {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import {
  CURRENCY_SYMBOLS,
  RETURN_REASONS,
  SSE_TIMEOUT,
} from '../../../../utils/constants';
import {
  API_BASE_URL,
  GET_SIGN_URL,
  ON_UPDATE,
  ORDER_EVENT,
  RETURN_ORDER,
} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useUploadFile from '../../../../hooks/useUploadFile';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';

const CancelToken = axios.CancelToken;

const ReturnItem = ({
  navigation,
  route: {params},
}: {
  navigation: any;
  route: any;
}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const {
    maxReturnCount,
    associatedItems,
    item,
    providerId,
    state,
    orderId,
    bppId,
    bppUrl,
    transactionId,
  } = params;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const eventTimeOutRef = useRef<any>(null);
  const cancelEventSourceResponseRef = useRef<any[]>([]);
  const source = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const [quantity, setQuantity] = useState<number>(0);
  const [apiRequested, setApiRequested] = useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [selectedReason, setSelectedReason] = useState<any>(RETURN_REASONS[0]);
  const [photos, setPhotos] = useState<any[]>([]);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {uploadFile} = useUploadFile();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const updateSelectedReason = (reason: any) => {
    setSelectedReason(reason);
    closeMenu();
  };

  const handleChoosePhoto = async () => {
    const options: any = {
      selectionLimit: 1,
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    };
    const response = await launchImageLibrary(options);
    if (response.didCancel) {
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      setPhotos(response.assets);
    }
  };

  const removePhoto = (photoIndex: number) => {
    setPhotos(photos.filter((one, index) => photoIndex !== index));
  };

  // on cancel Api
  const getReturnOrderDetails = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_UPDATE}${messageId}`,
        source.current.token,
      );
      cancelEventSourceResponseRef.current = [
        ...cancelEventSourceResponseRef.current,
        data[0],
      ];
      if (data?.message) {
        navigation.goBack();
      } else {
        showToastWithGravity(
          t(
            'Return Items.Something went wrong, product status cannot be updated',
          ),
        );
        setApiRequested(false);
        return;
      }
      setApiRequested(false);
    } catch (err: any) {
      setApiRequested(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  // STATUS APIS
  // use this function to fetch support info through events
  const fetchReturnDataEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ORDER_EVENT}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_update', (event: any) => {
      const data = JSON.parse(event?.data);
      getReturnOrderDetails(data.messageId).then(() => {});
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (cancelEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          t(
            'Return Items.Cannot proceed with you request now. Please try again',
          ),
        );
        setApiRequested(false);
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  const returnOrder = async () => {
    cancelEventSourceResponseRef.current = [];
    setApiRequested(true);
    source.current = CancelToken.source();
    try {
      const signedUrlResponse = await postDataWithAuth(
        `${API_BASE_URL}${GET_SIGN_URL}/${orderId}`,
        {
          fileType: photos[0]?.type.split('/')[1],
        },
        source.current.token,
      );
      await uploadFile(signedUrlResponse.data.urls, photos[0]?.uri);

      const items = [
        {
          id: item.id,
          quantity: {
            count: quantity,
          },
          tags: {
            update_type: 'return',
            reason_code: selectedReason.key,
            ttl_approval: item.product['@ondc/org/return_window']
              ? item.product['@ondc/org/return_window']
              : '',
            ttl_reverseqc: 'P3D',
            image: signedUrlResponse.data.publicUrl,
          },
          parent_item_id: item.parent_item_id,
        },
      ];

      if (associatedItems.length > 0) {
        associatedItems.forEach((one: any) => {
          items.push({
            id: one.id,
            quantity: {
              count: quantity,
            },
            tags: {
              update_type: 'return',
              reason_code: selectedReason.key,
              ttl_approval: item.product['@ondc/org/return_window']
                ? item.product['@ondc/org/return_window']
                : '',
              ttl_reverseqc: 'P3D',
              image: signedUrlResponse.data.publicUrl,
            },
            parent_item_id: item.parent_item_id,
          });
        });
      }
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${RETURN_ORDER}`,
        [
          {
            context: {
              bpp_id: bppId,
              bpp_uri: bppUrl,
              transaction_id: transactionId,
            },
            message: {
              update_target: 'item',
              order: {
                id: orderId,
                state: state,
                provider: {
                  id: providerId,
                },
                items: items,
              },
            },
          },
        ],
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data[0].message.ack.status === 'NACK') {
        setApiRequested(false);
        showToastWithGravity(
          t('Return Items.Something went wrong, please try again'),
        );
      } else {
        fetchReturnDataEvents(data[0].context.message_id);
      }
    } catch (err: any) {
      showToastWithGravity(err?.message);
      setApiRequested(false);
    }
  };

  useEffect(() => {
    if (item) {
      setQuantity(maxReturnCount);
    }
  }, [item]);

  const cancellable = item.product['@ondc/org/cancellable'];
  const returnable = item.product['@ondc/org/returnable'];

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'clear'} color={theme.colors.neutral400} size={20} />
        </TouchableOpacity>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {t('Return Items.Return Items')}
        </Text>
      </View>

      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.itemMeta}>
            <FastImage
              source={{uri: item.product?.descriptor?.symbol}}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text variant={'bodyMedium'} style={styles.itemName}>
                  {item.product?.descriptor?.name}
                </Text>
                <View style={styles.priceContainer}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      disabled={apiRequested}
                      style={styles.decrementButton}
                      onPress={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}>
                      <FontIcon name={'minus'} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Text variant={'bodyMedium'} style={styles.quantity}>
                      {formatNumber(quantity)}
                    </Text>
                    <TouchableOpacity
                      disabled={apiRequested}
                      style={styles.incrementButton}
                      onPress={() => {
                        if (quantity < maxReturnCount) {
                          setQuantity(quantity + 1);
                        }
                      }}>
                      <FontIcon name={'plus'} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text variant={'labelLarge'} style={styles.quantity}>
                    {CURRENCY_SYMBOLS[item.product?.price?.currency]}
                    {formatNumber(
                      Number(
                        quantity * maxReturnCount * item.product?.price?.value,
                      ).toFixed(2),
                    )}
                  </Text>
                </View>
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
          <View style={styles.inputField}>
            <Text variant={'bodyLarge'} style={styles.message}>
              {t('Return Item.Select reason')}*
            </Text>
            <Menu
              contentStyle={styles.menuContainer}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  style={styles.selectDropdown}
                  onPress={openMenu}>
                  <Text variant={'bodySmall'} style={styles.dropdownText}>
                    {selectedReason.value}
                  </Text>
                  <Icon
                    name={'keyboard-arrow-down'}
                    size={20}
                    color={theme.colors.neutral400}
                  />
                </TouchableOpacity>
              }>
              {RETURN_REASONS.filter(
                (one: any) => !one.isApplicableForCancellation,
              ).map((one: any) => {
                const selected = selectedReason.value === one.value;
                return (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    key={one.key}
                    onPress={() => updateSelectedReason(one)}>
                    {selected ? (
                      <Text
                        variant={'bodyLarge'}
                        style={styles.selectedDropdownText}>
                        {one.value}
                      </Text>
                    ) : (
                      <Text variant={'bodySmall'} style={styles.dropdownText}>
                        {one.value}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Menu>
          </View>
          <View style={styles.inputField}>
            <Text variant={'bodyMedium'} style={styles.message}>
              {t('Return Item.Upload Images')}*
            </Text>
            <View style={styles.fileContainer}>
              <TouchableOpacity
                disabled={apiRequested}
                style={styles.browseButton}
                onPress={handleChoosePhoto}>
                <Text variant={'labelMedium'} style={styles.browseLabel}>
                  {t('Return Item.Browse')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              {photos?.map((photo, index) => (
                <View key={`Image${index}`}>
                  <Image
                    source={{
                      uri: photo.uri,
                    }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => removePhoto(index)}>
                    <Icon
                      name={'cancel'}
                      size={16}
                      color={theme.colors.neutral400}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode={'contained'}
          contentStyle={styles.buttonContent}
          style={styles.confirmButton}
          disabled={apiRequested}
          loading={apiRequested}
          onPress={returnOrder}>
          {t('Return Items.Confirm')}
        </Button>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    page: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
    },
    pageTitle: {
      marginLeft: 20,
      color: colors.neutral400,
    },
    message: {
      color: colors.neutral400,
      marginBottom: 4,
    },
    container: {
      padding: 16,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    itemImage: {
      width: 44,
      height: 44,
      borderRadius: 8,
      marginRight: 10,
      backgroundColor: colors.neutral100,
    },
    itemDetails: {
      flex: 1,
    },
    itemHeader: {
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
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityContainer: {
      borderRadius: 8,
      borderColor: colors.primary,
      borderWidth: 1,
      backgroundColor: colors.white,
      flexDirection: 'row',
      height: 36,
      alignItems: 'center',
      marginRight: 4,
    },
    decrementButton: {
      padding: 8,
      marginRight: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    incrementButton: {
      padding: 8,
      marginLeft: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemName: {
      color: colors.neutral400,
    },
    quantity: {
      color: colors.neutral300,
      paddingHorizontal: 4,
    },
    selectDropdown: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.neutral200,
      paddingHorizontal: 9,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownItem: {
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    dropdownText: {
      flex: 1,
      color: colors.neutral400,
    },
    selectedDropdownText: {
      color: colors.primary,
    },
    menuContainer: {
      backgroundColor: colors.white,
      marginTop: 16,
      marginRight: 32,
    },
    inputField: {
      marginTop: 20,
    },
    fileContainer: {
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.neutral200,
      padding: 8,
    },
    browseButton: {
      backgroundColor: colors.neutral100,
      borderColor: colors.neutral300,
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      width: 65,
    },
    browseLabel: {
      color: colors.neutral400,
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    image: {
      width: 40,
      height: 40,
      marginRight: 8,
      borderRadius: 6,
      borderColor: colors.neutral200,
      borderWidth: 1,
      objectFit: 'contain',
    },
    removeImage: {
      position: 'absolute',
      marginLeft: 32,
      marginTop: -6,
      borderRadius: 72,
      width: 16,
      height: 16,
      backgroundColor: colors.white,
    },
    buttonContainer: {
      padding: 16,
    },
    confirmButton: {
      borderRadius: 12,
    },
    buttonContent: {
      height: 44,
    },
  });

export default ReturnItem;
