import React from 'react';
import {List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import FBProduct from './FBProduct';
import {getFilterCategory} from '../../../../utils/utils';
import {useAppTheme} from '../../../../utils/theme';

interface CustomMenuAccordion {
  section: any;
  selectedFilter: string;
}

const CustomMenuAccordion: React.FC<CustomMenuAccordion> = ({
  section,
  selectedFilter,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  let itemLength = section?.items?.length;

  return (
    <List.Accordion
      id={section.id}
      style={styles.accordion}
      title={
        <Text variant={'headlineSmall'} style={styles.heading}>
          {section?.descriptor?.name}{' '}
          {section?.items ? `(${section?.items?.length})` : ''}
        </Text>
      }>
      {section?.items
        ?.filter(
          (item: any) =>
            selectedFilter.length === 0 ||
            getFilterCategory(item?.item_details?.tags) === selectedFilter,
        )
        .map((item: any, index: number) => (
          <View key={item.id}>
            <FBProduct product={item} />
            {itemLength === index + 1 ? (
              <View style={styles.lastItem} />
            ) : (
              <View style={styles.itemSeparator} />
            )}
          </View>
        ))}
    </List.Accordion>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    heading: {
      color: colors.neutral400,
    },
    itemSeparator: {
      marginVertical: 24,
      backgroundColor: colors.neutral100,
      height: 1,
    },
    lastItem: {
      marginBottom: 24,
    },
    accordion: {
      padding: 0,
      backgroundColor: colors.white,
    },
  });

export default CustomMenuAccordion;
