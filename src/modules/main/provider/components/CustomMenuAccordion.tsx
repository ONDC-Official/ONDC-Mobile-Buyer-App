import React, {useEffect, useMemo, useState} from 'react';
import {List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';
import ListProduct from './ListProduct';

interface CustomMenuAccordion {
  section: any;
  provider: any;
  defaultExpand: boolean;
  isOpen: boolean;
}

const CustomMenuAccordion: React.FC<CustomMenuAccordion> = ({
  section,
  provider,
  defaultExpand,
  isOpen,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpand);

  useEffect(() => {
    if (defaultExpand) {
      setExpanded(defaultExpand);
    } else {
      setExpanded(false);
    }
  }, [defaultExpand]);

  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const handleAccordionClick = () => setExpanded(!expanded);

  let itemLength = useMemo(() => section?.items?.length, [section]);

  return (
    <List.Accordion
      expanded={expanded}
      onPress={handleAccordionClick}
      id={section.id}
      style={styles.accordion}
      title={
        <Text variant={'titleLarge'} style={styles.heading}>
          {section?.descriptor?.name} {itemLength > 0 ? `(${itemLength})` : ''}
        </Text>
      }>
      {section?.items?.map((item: any, index: number) => (
        <View key={item.id}>
          <ListProduct
            product={item}
            provider={provider}
            isOpen={isOpen}
            listView
          />
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
