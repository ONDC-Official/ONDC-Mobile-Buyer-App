import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface FilterList {
  attributes: any[];
  getAttributeValues: (attribute: string) => void;
  selectedAttributes: any;
  setSelectedAttributes: (values: any) => void;
  close: () => void;
}

const ValuesSkeleton = () => {
  const theme = useTheme();
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
  const theme = useTheme();
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
        <Text variant={'titleSmall'}>Filters</Text>
        <Button mode={'text'} compact onPress={clearAll}>
          Clear all
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
              variant={'bodyMedium'}
              style={[styles.buttonLabel, styles.closeLabel]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={updateFilters}>
            <Text
              variant={'bodyMedium'}
              style={[styles.buttonLabel, styles.applyLabel]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
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
      borderBottomColor: '#ebebeb',
    },
    filterContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    attributes: {
      flex: 1,
      borderRightColor: '#ebebeb',
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
      color: '#1A1A1A',
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
      color: '#151515',
    },
    applyLabel: {
      color: '#fff',
    },
    buttonLabel: {
      fontWeight: '600',
      textAlign: 'center',
    },
    closeButton: {
      borderRadius: 8,
      borderColor: '#151515',
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
      fontWeight: '500',
    },
  });

export default FilterList;
