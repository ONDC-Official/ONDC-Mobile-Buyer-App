import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const ItemDetails = ({
  fulfillments,
  items,
}: {
  fulfillments: any[];
  items: any[];
}) => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <>
      {fulfillments.map(fulfillment => (
        <TouchableOpacity
          key={fulfillment.id}
          style={styles.container}
          onPress={() => navigation.navigate('OrderProductDetails')}>
          <View style={styles.header}>
            <Text variant={'labelMedium'} style={styles.deliveryDate}>
              Order will be delivered by{' '}
              {moment(fulfillment?.end?.time?.range?.end).format('Do MMM')}
            </Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusChip}>
                <Text variant={'labelMedium'} style={styles.statusText}>
                  {fulfillment?.state?.descriptor?.code}
                </Text>
              </View>
              <Icon name={'chevron-right'} size={20} color={'#686868'} />
            </View>
          </View>
          <View>
            {items
              .filter(item => item.fulfillment_id === fulfillment.id)
              .map(item => (
                <View key={item.id} style={styles.item}>
                  <FastImage
                    source={{uri: item?.product?.descriptor?.symbol}}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemMeta}>
                    <Text variant={'labelMedium'} style={styles.itemName}>
                      {item?.product?.descriptor?.name}
                    </Text>
                    <View style={styles.itemTags}>
                      {item?.product['@ondc/org/cancellable'] ? (
                        <View style={styles.chip}>
                          <Text variant={'labelMedium'}>Cancellable</Text>
                        </View>
                      ) : (
                        <View style={styles.chip}>
                          <Text variant={'labelMedium'}>Non-cancellable</Text>
                        </View>
                      )}
                      {item?.product['@ondc/org/returnable'] ? (
                        <View style={styles.chip}>
                          <Text variant={'labelMedium'}>Returnable</Text>
                        </View>
                      ) : (
                        <View style={styles.chip}>
                          <Text variant={'labelMedium'}>Non-returnable</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E8E8E8',
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
      paddingBottom: 12,
      marginBottom: 12,
      borderBottomColor: '#E8E8E8',
      borderBottomWidth: 1,
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
      marginBottom: 12,
      flexDirection: 'row',
    },
    itemImage: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 10,
      backgroundColor: '#E8E8E8',
    },
    itemMeta: {
      flex: 1,
    },
    itemName: {
      marginBottom: 4,
    },
    itemTags: {
      flexDirection: 'row',
    },
    chip: {
      marginRight: 4,
      backgroundColor: '#E8E8E8',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 22,
    },
    chipText: {
      color: '#686868',
      fontSize: 11,
    },
    deliveryDate: {
      color: '#686868',
      flex: 1,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
    },
    statusChip: {
      borderRadius: 26,
      paddingVertical: 2,
      paddingHorizontal: 8,
      backgroundColor: '#ECF3F8',
    },
    statusText: {
      color: colors.primary,
    },
  });

export default ItemDetails;
