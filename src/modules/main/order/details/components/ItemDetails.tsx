import {Chip, Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const ItemDetails = ({
  items,
  provider,
  orderId,
}: {
  items: any[];
  provider: any;
  orderId: string;
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.providerMeta}>
          <FastImage
            source={{uri: provider?.descriptor?.symbol}}
            style={styles.providerImage}
          />
          <Text variant={'titleLarge'}>{provider?.descriptor?.name}</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Icon name={'call'} size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <Text variant={'bodyMedium'} style={styles.orderId}>
        {orderId}
      </Text>
      {items?.map((item: any) => (
        <View id={item.id} style={styles.item}>
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
                <Chip compact style={styles.chip} textStyle={styles.chipText}>
                  Cancellable
                </Chip>
              ) : (
                <Chip compact style={styles.chip} textStyle={styles.chipText}>
                  Non-cancellable
                </Chip>
              )}
              {item?.product['@ondc/org/returnable'] ? (
                <Chip compact style={styles.chip} textStyle={styles.chipText}>
                  Returnable
                </Chip>
              ) : (
                <Chip compact style={styles.chip} textStyle={styles.chipText}>
                  Non-returnable
                </Chip>
              )}
            </View>
          </View>
          <Icon name={'chevron-right'} size={20} color={'#686868'} />
        </View>
      ))}
    </View>
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
      marginBottom: 8,
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
      marginBottom: 8,
      flexDirection: 'row',
    },
    itemImage: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 10,
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
      borderRadius: 22,
    },
    chipText: {
      color: '#686868',
    },
  });

export default ItemDetails;
