import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useAppTheme} from '../../utils/theme';
import {useTranslation} from 'react-i18next';
import { convertHexToName } from "../../utils/utils";

interface FilterList {
  attributes: any[];
  getAttributeValues: (attribute: string) => void;
  selectedAttributes: any;
  setSelectedAttributes: (values: any) => void;
  close: () => void;
}

const ValuesSkeleton = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  return (
    <SkeletonPlaceholder>
      <View style={styles.valueRow}>
        <View style={styles.checkboxSkeleton} />
        <View style={styles.textSkeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

const FilterList: React.FC<FilterList> = ({
  attributes,
  getAttributeValues,
  selectedAttributes,
  setSelectedAttributes,
  close,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [currentAttribute, setCurrentAttribute] = useState<string>(
    attributes[0].code,
  );
  const [currentValues, setCurrentValues] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<any>({});

  const updateFilters = () => {
    setSelectedAttributes(selectedValues);
    close();
  };

  const removeValue = (value: string) => {
    const values = Object.assign({}, selectedValues);
    values[currentAttribute] = values[currentAttribute].filter(
      (one: string) => one !== value,
    );
    setSelectedValues(values);
  };

  const addValue = (value: string) => {
    const values = Object.assign({}, selectedValues);
    if (values.hasOwnProperty(currentAttribute)) {
      values[currentAttribute] = values[currentAttribute].concat([value]);
    } else {
      values[currentAttribute] = [value];
    }
    setSelectedValues(values);
  };

  const clearAll = () => setSelectedValues({});

  useEffect(() => {
    const attribute = attributes.find(one => one.code === currentAttribute);
    if (attribute && attribute.hasOwnProperty('values')) {
      setCurrentValues(attribute.values);
    } else {
      getAttributeValues(currentAttribute);
    }
  }, [currentAttribute, attributes]);

  useEffect(() => {
    setSelectedValues(selectedAttributes);
  }, [selectedAttributes]);

  return (
    <View style={styles.container}>
      <View style={styles.sheetHeader}>
        <Text variant={'titleLarge'} style={styles.title}>
          {t('Cart.Filter List.Filters')}
        </Text>
        <Button mode={'text'} compact onPress={clearAll}>
          {t('Cart.Filter List.Clear all')}
        </Button>
      </View>
      <View style={styles.filterContainer}>
        <ScrollView style={styles.attributes}>
          {attributes.map(attribute => {
            const selected = currentAttribute === attribute.code;
            return (
              <TouchableOpacity
                key={attribute.code}
                style={styles.attribute}
                onPress={() => setCurrentAttribute(attribute.code)}>
                <View style={selected ? styles.selected : styles.normal} />
                <Text
                  variant={'bodyMedium'}
                  style={[
                    selected ? styles.selectedText : styles.normalText,
                    styles.attributeText,
                  ]}>
                  {attribute.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ScrollView style={styles.attributeValues}>
          {currentValues.length === 0 ? (
            <>
              <ValuesSkeleton />
              <ValuesSkeleton />
              <ValuesSkeleton />
              <ValuesSkeleton />
            </>
          ) : (
            currentValues.map(value => {
              const isSelected =
                selectedValues[currentAttribute]?.includes(value);

              return (
                <TouchableOpacity
                  key={value}
                  style={styles.valueRow}
                  onPress={() =>
                    isSelected ? removeValue(value) : addValue(value)
                  }>
                  <Checkbox.Android
                    status={isSelected ? 'checked' : 'unchecked'}
                  />
                  <Text variant={'labelMedium'} style={styles.valueLabel}>
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={close}>
            <Text
              variant={'bodyLarge'}
              style={[styles.buttonLabel, styles.closeLabel]}>
              {t('Cart.Filter List.Close')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={updateFilters}>
            <Text
              variant={'bodyLarge'}
              style={[styles.buttonLabel, styles.applyLabel]}>
              {t('Cart.Filter List.Apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    title: {
      color: colors.neutral400,
    },
    filterContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    attributes: {
      flex: 1,
      borderRightColor: colors.neutral100,
      borderRightWidth: 1,
    },
    attributeValues: {
      flex: 1.5,
    },
    attribute: {
      paddingVertical: 8,
      paddingRight: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selected: {
      width: 6,
      backgroundColor: colors.primary,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      height: 30,
    },
    normal: {
      width: 6,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      height: 30,
    },
    selectedText: {
      color: colors.primary,
    },
    normalText: {
      color: colors.neutral400,
    },
    attributeText: {
      textTransform: 'capitalize',
      marginLeft: 10,
    },
    footer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      width: 15,
    },
    buttonContainer: {
      flex: 1,
    },
    button: {
      height: 36,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    closeLabel: {
      color: colors.neutral400,
    },
    applyLabel: {
      color: colors.white,
    },
    buttonLabel: {
      fontWeight: '600',
      textAlign: 'center',
    },
    closeButton: {
      borderRadius: 8,
      borderColor: colors.neutral400,
      borderWidth: 1,
    },
    applyButton: {
      borderRadius: 8,
      borderColor: colors.primary,
      borderWidth: 1,
      backgroundColor: colors.primary,
    },
    valueRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignItems: 'center',
      flex: 1,
    },
    checkboxSkeleton: {
      width: 16,
      height: 16,
    },
    textSkeleton: {
      marginLeft: 12,
      height: 16,
      width: 100,
    },
    valueLabel: {
      color: colors.neutral400,
      flex: 1,
    },
  });

export default FilterList;
