import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import React, {memo, useCallback, useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../utils/theme';
import {convertHexToName} from '../../utils/utils';
import {isIOS} from '../../utils/constants';

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
      <View style={styles.skeletonRow}>
        <View style={styles.checkboxSkeleton} />
        <View style={styles.textSkeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

const AttributeItem = memo(
  ({item, selected, onPress}: {item: any; selected: boolean; onPress: any}) => {
    const theme = useAppTheme();
    const styles = makeStyles(theme.colors);

    return (
      <TouchableOpacity style={styles.attribute} onPress={onPress}>
        <View style={selected ? styles.selected : styles.normal} />
        <Text
          variant={'bodyMedium'}
          style={[
            selected ? styles.selectedText : styles.normalText,
            styles.attributeText,
          ]}>
          {item.code}
        </Text>
      </TouchableOpacity>
    );
  },
);

const AttributeValueItem = memo(
  ({
    value,
    isSelected,
    currentAttribute,
    removeValue,
    addValue,
  }: {
    value: any;
    isSelected: boolean;
    currentAttribute: any;
    removeValue: any;
    addValue: any;
  }) => {
    const theme = useAppTheme();
    const styles = makeStyles(theme.colors);

    const handlePress = useCallback(() => {
      isSelected ? removeValue(value) : addValue(value);
    }, [isSelected, removeValue, addValue, value]);

    if (currentAttribute === 'colour') {
      return (
        <TouchableOpacity
          key={value}
          style={styles.valueRow}
          onPress={handlePress}>
          <View
            style={[
              styles.dotContainer,
              isSelected ? styles.selectedDotContainer : {},
            ]}>
            <View style={[styles.colorDot, {backgroundColor: value}]} />
          </View>
          <Text variant={'labelMedium'}>{convertHexToName(value)}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={value}
          style={styles.valueRow}
          onPress={handlePress}>
          <Checkbox.Android status={isSelected ? 'checked' : 'unchecked'} />
          <Text variant={'labelMedium'} style={styles.valueLabel}>
            {value}
          </Text>
        </TouchableOpacity>
      );
    }
  },
);

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

  const clearAll = () => setSelectedValues({});

  const renderAttributeItem = useCallback(
    ({item}: {item: any}) => {
      const selected = currentAttribute === item.code;
      return (
        <AttributeItem
          item={item}
          selected={selected}
          onPress={() => setCurrentAttribute(item.code)}
        />
      );
    },
    [currentAttribute, setCurrentAttribute],
  );

  const renderAttributeValueItem = useCallback(
    ({item}: {item: any}) => {
      const isSelected = selectedValues[currentAttribute]?.includes(item);

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

      return (
        <AttributeValueItem
          value={item}
          isSelected={isSelected}
          currentAttribute={currentAttribute}
          removeValue={removeValue}
          addValue={addValue}
        />
      );
    },
    [selectedValues, currentAttribute],
  );

  const attributeValueKeyExtractor = useCallback(item => item, []);

  useEffect(() => {
    const attribute = attributes.find(one => one.code === currentAttribute);
    if (attribute && attribute.hasOwnProperty('values')) {
      setCurrentValues(attribute.values);
    } else {
      setCurrentValues([]);
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
        <TouchableOpacity onPress={clearAll}>
          <Text variant={'bodyMedium'} style={styles.clearButton}>
            {t('Cart.Filter List.Clear all')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.attributes}>
          <FlatList
            data={attributes}
            renderItem={renderAttributeItem}
            keyExtractor={item => item.code}
          />
        </View>
        <View style={styles.attributeValues}>
          {currentValues.length === 0 ? (
            <View>
              <ValuesSkeleton />
              <ValuesSkeleton />
              <ValuesSkeleton />
              <ValuesSkeleton />
            </View>
          ) : (
            <FlatList
              data={currentValues}
              renderItem={renderAttributeValueItem}
              keyExtractor={attributeValueKeyExtractor}
            />
          )}
        </View>
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
      paddingBottom: isIOS ? 16 : 0,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
      height: 56,
    },
    title: {
      color: colors.neutral400,
    },
    clearButton: {
      color: colors.primary,
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
      justifyContent: 'center',
      height: 36,
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
      paddingVertical: 5,
      alignItems: 'center',
      flex: 1,
    },
    skeletonRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 5,
      alignItems: 'center',
      flex: 1,
      marginVertical: 16,
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
    dotContainer: {
      borderWidth: 2,
      borderColor: colors.neutral200,
      width: 24,
      height: 24,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    selectedDotContainer: {
      borderColor: colors.primary,
    },
    colorDot: {
      width: 16,
      height: 16,
      borderRadius: 12,
    },
  });

export default FilterList;
