import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../../utils/theme';
import {makeStyles} from '../../../../components/products/FilterList';

interface FilterList {
  selectedFilter: string;
  setSelectedFilter: (values: any) => void;
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
  selectedFilter,
  setSelectedFilter,
  close,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [attributes, setAttributes] = useState([
    {
      code: 'orderType',
      name: 'Order Type',
      values: [
        {name: 'Created,Accepted,In-progress', value: 'Ongoing'},
        {name: 'Completed', value: 'Completed'},
        {name: 'Cancelled', value: 'Cancelled'},
      ],
    },
  ]);
  const [currentAttribute, setCurrentAttribute] = useState<string>('orderType');
  const [currentValues, setCurrentValues] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>({});

  const updateFilters = () => {
    setSelectedFilter(selectedValue);
    close();
  };

  const removeValue = () => {
    setSelectedValue('');
  };

  const addValue = (name: string) => {
    setSelectedValue(name);
  };

  const clearAll = () => setSelectedValue('');

  useEffect(() => {
    setSelectedValue(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    const attribute = attributes.find(one => one.code === currentAttribute);
    setCurrentValues(attribute?.values ?? []);
  }, [currentAttribute, attributes]);

  return (
    <View style={styles.container}>
      <View style={styles.sheetHeader}>
        <Text variant={'titleLarge'} style={styles.title}>
          {t('Orders.Filter List.Filters')}
        </Text>
        <Button mode={'text'} compact onPress={clearAll}>
          {t('Orders.Filter List.Clear all')}
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
                  {t(`Orders.Filter List.${attribute.name}`)}
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
              const isSelected = selectedValue === value.name;
              return (
                <TouchableOpacity
                  key={value.name}
                  style={styles.valueRow}
                  onPress={() =>
                    isSelected ? removeValue() : addValue(value.name)
                  }>
                  <Checkbox.Android
                    status={isSelected ? 'checked' : 'unchecked'}
                  />
                  <Text variant={'labelMedium'} style={styles.valueLabel}>
                    {t(`Orders.Filter List.${value.value}`)}
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
              {t('Orders.Filter List.Close')}
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
              {t('Orders.Filter List.Apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FilterList;
