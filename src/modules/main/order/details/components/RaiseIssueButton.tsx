import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Formik} from 'formik';
import * as yup from 'yup';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import RNEventSource from 'react-native-event-source';
import CheckBox from 'react-native-check-box';
import RaiseComplaint from '../../../../../assets/raise_complaint.svg';
import {CURRENCY_SYMBOLS, SSE_TIMEOUT} from '../../../../../utils/constants';
import {appStyles} from '../../../../../styles/styles';
import InputField from '../../../../../components/input/InputField';
import DropdownField from '../../../../../components/input/DropdownField';
import {ISSUE_TYPES} from '../../../../../utils/issueTypes';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {
  API_BASE_URL,
  ISSUE,
  ON_ISSUE,
  RAISE_ISSUE,
} from '../../../../../utils/apiActions';
import {
  isItemCustomization,
  showToastWithGravity,
} from '../../../../../utils/utils';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

const validationSchema = yup.object({
  subcategory: yup.string().required('Subcategory is required'),
  shortDescription: yup
    .string()
    .max(200)
    .required('Short Description is required'),
  longDescription: yup
    .string()
    .max(1000)
    .required('Long Description is required'),
});

const categories = ISSUE_TYPES.map(item => {
  return item.subCategory.map(subcategoryItem => {
    return {
      ...subcategoryItem,
      category: item.value,
      label: subcategoryItem.value,
    };
  });
}).flat();

const CancelToken = axios.CancelToken;

const RaiseIssueButton = ({getOrderDetails}: {getOrderDetails: () => void}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const responseRef = useRef<any[]>([]);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);
  const {token} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const [visible, setVisible] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [productsWithIssue, setProductsWithIssue] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [raiseInProgress, setRaiseInProgress] = useState<boolean>(false);

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const reduceItemQuantity = (itemId: any) => {
    const products = productsWithIssue.concat([]);
    const item = products.find(one => one.id === itemId);
    item.quantity.count -= 1;
    setProductsWithIssue(products);
  };

  const increaseItemQuantity = (itemId: any) => {
    const products = productsWithIssue.concat([]);
    const item = products.find(one => one.id === itemId);
    item.quantity.count += 1;
    setProductsWithIssue(products);
  };

  const handleChoosePhoto = async () => {
    const options: any = {
      selectionLimit: 4,
      includeBase64: true,
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

  const onSuccess = () => {
    hideDialog();
    showToastWithGravity('Complaint raised successfully!');
    getOrderDetails();
  };

  const removePhoto = (photoIndex: number) => {
    setPhotos(photos.filter((one, index) => photoIndex !== index));
  };

  // on Issue api
  const getPartialCancelOrderDetails = async (message_id, createdDateTime) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_ISSUE}${message_id}&createdDateTime=${createdDateTime}`,
        source.current.token,
      );
      responseRef.current = [...responseRef.current, data];
      setRaiseInProgress(false);
      onSuccess();
    } catch (err: any) {
      setRaiseInProgress(false);
      onSuccess();
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  const onRaiseIssue = (messageId: any, createdDateTime: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ISSUE}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_issue', (event: any) => {
      const data = JSON.parse(event.data);
      getPartialCancelOrderDetails(data.messageId, createdDateTime)
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        });
    });

    const timer = setTimeout(() => {
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
      if (responseRef.current.length <= 0) {
        setRaiseInProgress(false);
        return;
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  const raiseIssue = async (values: any) => {
    try {
      setRaiseInProgress(true);
      const selectedCategory = categories.find(
        one => one.value === values.subcategory,
      );
      const createdDateTime = new Date().toISOString();
      const items = productsWithIssue.filter(item =>
        selectedItems.includes(item.id),
      );
      const params = {
        context: {
          city: orderDetails?.fulfillments[0]?.end?.location?.address?.city,
          state: orderDetails?.fulfillments[0]?.end?.location?.address?.state,
          transaction_id: orderDetails?.transactionId,
          domain: orderDetails?.domain,
        },
        message: {
          issue: {
            category: selectedCategory?.category.toUpperCase(),
            sub_category: selectedCategory?.enums,
            bppId: orderDetails?.bppId,
            bpp_uri: orderDetails?.bpp_uri,
            created_at: createdDateTime,
            updated_at: createdDateTime,
            complainant_info: {
              person: {
                name: orderDetails?.billing?.name,
              },
              contact: {
                phone: orderDetails?.billing?.phone,
                email: orderDetails?.billing?.email,
              },
            },
            description: {
              short_desc: values.shortDescription,
              long_desc: values.longDescription,
              additional_desc: {
                url: 'https://buyerapp.com/additonal-details/desc.txt',
                content_type: 'text/plain',
              },
              images: photos?.map(
                (photo: any) => `data:image/*;base64,${photo.base64}`,
              ),
            },
            order_details: {
              id: orderDetails?.id,
              state: orderDetails?.state,
              items,
              fulfillments: orderDetails?.fulfillments,
              provider_id: orderDetails?.provider?.id,
            },
            issue_actions: {
              complainant_actions: [],
              respondent_actions: [],
            },
          },
        },
      };

      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${RAISE_ISSUE}`,
        params,
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data.message && data.message.ack.status === 'NACK') {
        showToastWithGravity('Something went wrong');
        setRaiseInProgress(false);
      } else {
        onRaiseIssue(data.context?.message_id, createdDateTime);
      }
    } catch (err: any) {
      showToastWithGravity(err?.message);
      setRaiseInProgress(false);
    }
  };

  useEffect(() => {
    if (orderDetails) {
      setProductsWithIssue(orderDetails?.items.concat([]));
    }
  }, [orderDetails]);

  const availableCategories = useMemo(() => {
    if (
      orderDetails?.state === 'Accepted' ||
      orderDetails?.state === 'In-progress'
    ) {
      return categories.filter(one => one.enums === 'FLM02');
    } else {
      return categories;
    }
  }, [categories, orderDetails?.state]);

  return (
    <>
      {orderDetails?.state !== 'Cancelled' && (
        <TouchableOpacity style={styles.container} onPress={showDialog}>
          <RaiseComplaint width={42} height={42} />
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Profile.Raise Issue')}
          </Text>
          <Icon
            name={'keyboard-arrow-right'}
            size={20}
            color={theme.colors.neutral300}
          />
        </TouchableOpacity>
      )}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideDialog}
          contentContainerStyle={styles.dialog}>
          <View style={styles.header}>
            <Text variant={'titleLarge'} style={styles.modalTitle}>
              {t('Raise Issue.Raise an Issue')}
            </Text>
            <TouchableOpacity onPress={hideDialog}>
              <Icon name={'clear'} size={20} color={theme.colors.neutral400} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.details}>
              <Text variant={'bodyMedium'} style={styles.message}>
                {t('Raise Issue.Choose items that had a problem')}*
              </Text>
              {productsWithIssue?.map((item: any, index: number) => {
                const itemSelected = selectedItems.includes(item.id);
                const itemCustomization = isItemCustomization(item.tags);

                if (itemCustomization) {
                  return <View key={item.id} />;
                }

                return (
                  <View key={item.id} style={styles.itemContainer}>
                    <CheckBox
                      style={styles.checkbox}
                      onClick={() => {
                        if (itemSelected) {
                          setSelectedItems(
                            selectedItems.filter(one => one !== item.id),
                          );
                        } else {
                          setSelectedItems(selectedItems.concat([item.id]));
                        }
                      }}
                      isChecked={itemSelected}
                      checkedImage={
                        <Image
                          source={require('../../../../../assets/checkbox.png')}
                          style={styles.checkboxImage}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={require('../../../../../assets/emptyCheckbox.png')}
                          style={styles.checkboxImage}
                        />
                      }
                    />
                    <FastImage
                      source={{uri: item?.product?.descriptor?.symbol}}
                      style={styles.productImage}
                    />
                    <Text
                      variant={'labelMedium'}
                      numberOfLines={2}
                      ellipsizeMode={'tail'}
                      style={styles.productName}>
                      {item?.product?.descriptor?.name}
                    </Text>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        disabled={!itemSelected || item?.quantity?.count === 1}
                        style={styles.incrementButton}
                        onPress={() => reduceItemQuantity(item.id)}>
                        <CommunityIcon
                          name={'minus'}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>
                      <Text variant={'labelMedium'} style={styles.quantity}>
                        {item?.quantity?.count}
                      </Text>
                      <TouchableOpacity
                        disabled={
                          !itemSelected ||
                          orderDetails?.items[index].quantity.count ===
                            item?.quantity?.count
                        }
                        style={styles.incrementButton}
                        onPress={() => increaseItemQuantity(item.id)}>
                        <CommunityIcon
                          name={'plus'}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text variant={'labelLarge'} style={styles.amount}>
                      {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                      {(
                        item?.quantity?.count * item?.product?.price?.value
                      ).toFixed(2)}
                    </Text>
                  </View>
                );
              })}
              <View>
                <Formik
                  initialValues={{
                    subcategory: '',
                    shortDescription: '',
                    longDescription: '',
                    email: String(orderDetails?.billing?.email || ''),
                  }}
                  validationSchema={validationSchema}
                  onSubmit={raiseIssue}>
                  {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                    setFieldValue,
                    handleSubmit,
                  }) => (
                    <View style={styles.formContainer}>
                      <View style={appStyles.inputContainer}>
                        <DropdownField
                          inputLabel={'Select Issue Subcategory'}
                          disabled={raiseInProgress}
                          name="subcategory"
                          value={values.subcategory}
                          setValue={(newValue: any) =>
                            setFieldValue('subcategory', newValue)
                          }
                          label=""
                          placeholder="Select Issue Subcategory"
                          error={!!touched.subcategory && !!errors.subcategory}
                          errorMessage={
                            touched.subcategory ? errors.subcategory : null
                          }
                          list={availableCategories}
                        />
                      </View>
                      <View style={appStyles.inputContainer}>
                        <InputField
                          required
                          inputLabel={'Short Description'}
                          disabled={raiseInProgress}
                          name="shortDescription"
                          value={values.shortDescription}
                          onBlur={handleBlur('shortDescription')}
                          label=""
                          placeholder="Short Description"
                          error={
                            !!touched.shortDescription &&
                            !!errors.shortDescription
                          }
                          errorMessage={
                            touched.shortDescription
                              ? errors.shortDescription
                              : null
                          }
                          onChangeText={handleChange('shortDescription')}
                        />
                      </View>
                      <View style={appStyles.inputContainer}>
                        <InputField
                          required
                          inputLabel={'Long Description'}
                          disabled={raiseInProgress}
                          name="longDescription"
                          value={values.longDescription}
                          onBlur={handleBlur('longDescription')}
                          label=""
                          placeholder="Long Description"
                          error={
                            !!touched.longDescription &&
                            !!errors.longDescription
                          }
                          errorMessage={
                            touched.longDescription
                              ? errors.longDescription
                              : null
                          }
                          onChangeText={handleChange('longDescription')}
                        />
                      </View>
                      <View style={appStyles.inputContainer}>
                        <InputField
                          inputLabel={'Email'}
                          disabled
                          name="email"
                          value={values.email}
                          onBlur={handleBlur('email')}
                          label=""
                          placeholder="Email"
                          error={!!touched.email && !!errors.email}
                          errorMessage={touched.email ? errors.email : null}
                          onChangeText={handleChange('email')}
                        />
                      </View>
                      <View style={appStyles.inputContainer}>
                        <Text variant={'bodyMedium'} style={styles.inputLabel}>
                          {t('Raise Issue.Images (Maximum 4)')}
                        </Text>
                        <View style={styles.fileContainer}>
                          <TouchableOpacity
                            disabled={raiseInProgress}
                            style={styles.browseButton}
                            onPress={handleChoosePhoto}>
                            <Text
                              variant={'labelMedium'}
                              style={styles.browseButtonLabel}>
                              {t('Raise Issue.Browse')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                          {photos?.map((photo, index) => (
                            <View key={`Image${index}`}>
                              <Image
                                source={{
                                  uri: `data:image/*;base64,${photo.base64}`,
                                }}
                                style={styles.image}
                              />
                              <TouchableOpacity
                                style={styles.removeImage}
                                onPress={() => removePhoto(index)}>
                                <Icon
                                  name={'cancel'}
                                  size={20}
                                  color={theme.colors.error}
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.buttonContainer}>
                        <Button
                          contentStyle={styles.buttonContent}
                          style={styles.button}
                          mode="outlined"
                          onPress={hideDialog}
                          disabled={raiseInProgress}>
                          Cancel
                        </Button>
                        <View style={styles.separator} />
                        <Button
                          contentStyle={styles.buttonContent}
                          style={styles.button}
                          mode="contained"
                          onPress={() => handleSubmit()}
                          loading={raiseInProgress}
                          disabled={
                            raiseInProgress || selectedItems.length === 0
                          }>
                          Confirm
                        </Button>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.neutral100,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 16,
    },
    title: {
      marginLeft: 8,
      color: colors.neutral400,
      flex: 1,
    },
    modalTitle: {
      color: colors.neutral400,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomColor: colors.neutral100,
      borderBottomWidth: 1,
    },
    details: {
      padding: 16,
    },
    message: {
      color: colors.neutral500,
    },
    paddingZero: {
      padding: 0,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    productImage: {
      width: 32,
      height: 32,
      borderRadius: 5,
    },
    checkbox: {
      marginRight: 12,
    },
    checkboxImage: {
      width: 20,
      height: 20,
    },
    productName: {
      flex: 1,
      marginLeft: 10,
      color: colors.neutral300,
    },
    quantityContainer: {
      borderRadius: 6,
      borderColor: colors.neutral100,
      borderWidth: 1,
      backgroundColor: colors.white,
      flexDirection: 'row',
      height: 26,
      alignItems: 'center',
      marginRight: 18,
      width: 70,
    },
    quantity: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
      color: colors.neutral500,
    },
    incrementButton: {
      paddingHorizontal: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialog: {
      backgroundColor: colors.white,
      marginHorizontal: 16,
      borderRadius: 16,
    },
    amount: {
      width: 50,
      textAlign: 'right',
      color: colors.neutral300,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    buttonContent: {
      height: 44,
    },
    button: {
      flex: 1,
      borderRadius: 8,
      borderColor: colors.primary,
    },
    separator: {
      width: 16,
    },
    formContainer: {
      marginTop: 16,
    },
    inputLabel: {
      marginBottom: 4,
    },
    fileContainer: {
      borderWidth: 1,
      borderRadius: 12,
      borderColor: '#B9B9B9',
      padding: 8,
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    image: {
      width: 72,
      height: 72,
      marginRight: 8,
    },
    removeImage: {
      position: 'absolute',
    },
    browseButton: {
      backgroundColor: colors.neutral100,
      borderRadius: 4,
      borderColor: colors.neutral300,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 6,
      width: 65,
    },
    browseButtonLabel: {
      color: colors.neutral400,
    },
  });

export default RaiseIssueButton;
