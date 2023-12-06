import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';

import {COLOR_CODE_TO_NAME} from '../../utils/colorCodes';

interface VariationsRenderer {
  product: any;
  variationState: any;
  setVariationState: (variations: any[]) => void;
  chartImage?: string;
  isFashion: boolean;
}

const VariationsRenderer: React.FC<VariationsRenderer> = ({
  product,
  variationState,
  setVariationState,
  chartImage = '',
  isFashion = false,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [variationGroups, setVariationGroups] = useState<any[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [initialVariationState, setInitialVariationState] = useState<any>({});
  const [isUOM, setIsUOM] = useState<boolean>(false);
  const [openSizeChart, setOpenSizeChart] = useState<boolean>(false);
  const [noVariations, setNoVariations] = useState<boolean>(false);

  const getVariationGroups = () => {
    const parentId = product.item_details.parent_item_id;
    const parentData = product.categories.find(
      (item: any) => item.id === parentId,
    );

    if (parentData) {
      const groupInfo = new Set(); // Use a Set to store unique items

      for (const tag of parentData.tags) {
        if (tag.code === 'attr') {
          let nameTag = null;
          let seqTag = null;
          tag.list.forEach((item: any) => {
            if (item.code === 'name') {
              nameTag = item;
            } else if (item.code === 'seq') {
              seqTag = item;
            }
          });

          if (nameTag && seqTag) {
            const nameParts = nameTag.value.split('.');
            const name = nameParts[nameParts.length - 1];
            const seq = Number(seqTag.value);

            const item = {name, seq};

            // Convert the object to a JSON string to ensure uniqueness
            const itemString: string = JSON.stringify(item);

            // Check if the item already exists in the Set
            if (!groupInfo.has(itemString)) {
              // If it doesn't exist, add it to the Set
              groupInfo.add(itemString);
            }

            const uniqueGroupInfo = Array.from(groupInfo).map((item: any) =>
              JSON.parse(item),
            );
            setVariationGroups(uniqueGroupInfo);
            getRelatedVariations(uniqueGroupInfo);
            getInitialVariationState(uniqueGroupInfo);
          }
        }
      }
    } else {
      setNoVariations(true);
    }
  };

  const getInitialVariationState = (groupInfo: any) => {
    const parentId = product.item_details.parent_item_id;

    const tags = product.categories.find(item => item.id === parentId)?.tags;
    const attr = tags?.find((tag: any) => tag.code === 'attr');
    const name = attr?.list.find((attribute: any) => attribute.code === 'name');

    if (name?.value === 'item.quantity.unitized.measure') {
      setInitialVariationState({isUOM: true});
      setIsUOM(true);
    } else {
      setIsUOM(false);
      const newState: any = {};
      groupInfo.forEach((group: any) => {
        const attributeName = group.name;
        newState[attributeName] = product.attributes[attributeName];
      });
      setInitialVariationState(newState);
    }
  };

  const getRelatedVariations = (variationList: any) => {
    const relatedItems = product?.related_items?.map((item: any) => {
      const attributes = item.attributes;
      const variationsInfo: any = {};
      variationList.forEach((variation: any) => {
        variationsInfo[variation?.name] = attributes[variation?.name];
      });
      return {
        id: item.id,
        price: item.item_details.price.value,
        img: item.item_details.descriptor.symbol,
        ...variationsInfo,
      };
    });

    setVariations(relatedItems);
  };

  const findMatchingVariation = () => {
    // Iterate through variations
    for (const variation of variations) {
      let isMatch = true;

      // Iterate through variationState
      for (const groupId in variationState) {
        if (variationState.hasOwnProperty(groupId)) {
          const groupData = variationState[groupId];
          const groupName = groupData.name;
          const selectedOption = groupData.selected[0];

          // Check if the variation matches the values in variationState
          if (variation[groupName] !== selectedOption) {
            isMatch = false;
            break; // No need to continue checking
          }
        }
      }

      // If all values in variationState matched this variation, return it
      if (isMatch) {
        return variation;
      }
    }

    return null; // No matching variation found
  };

  const handleVariationClick = (groupData: any, option: any) => {
    let updatedVariationState = {...variationState};
    groupData.selected = [option];
    updatedVariationState[groupData.id] = groupData;

    if (groupData.id === Object.keys(variationState).length) {
      const matchingVariation = findMatchingVariation();
      if (matchingVariation) {
        navigation.navigate('ProductDetails', {
          productId: matchingVariation.id,
        });
      }
    }

    const isLastGroup = groupData.id === Object.keys(variationState).length;
    if (!isLastGroup) {
      const lastGroupId = Object.keys(variationState).length;
      updatedVariationState[lastGroupId].selected = [];
    }

    variationGroups.forEach((group, index) => {
      const groupName = group.name;
      const groupId = group.seq;

      const newGroupData: any = {
        id: groupId,
        name: groupName,
        selected: [updatedVariationState[index + 1].selected[0]],
        options: [],
      };

      if (index + 1 === 1) {
        variations.forEach(variation => {
          newGroupData.productId = variation.productId;
          if (!newGroupData.options.includes(variation[groupName])) {
            newGroupData.options.push(variation[groupName]);
          }
        });
      } else {
        const prevGroupName = updatedVariationState[index].name;
        const prevGroupSelection = updatedVariationState[index].selected[0];

        variations.forEach(variation => {
          //  newGroupData.productId = variation.productId;
          if (variation[prevGroupName] === prevGroupSelection) {
            if (!newGroupData.options.includes(variation[groupName])) {
              newGroupData.options.push(variation[groupName]);
            }
          }
        });
      }

      updatedVariationState[groupId] = newGroupData;
    });

    setVariationState(updatedVariationState);
  };

  const handleUOMClick = (groupData: any, option: any) => {
    const toFind = option.split(' ')[0];
    const relatedItem = product.related_items.find((item: any) => {
      const value = item.item_details.quantity.unitized.measure.value;
      if (Number(value) === Number(toFind)) {
        return item;
      }
    });
    navigation.navigate('ProductDetails', {productId: relatedItem.id});
  };

  useEffect(() => {
    if (product) {
      getVariationGroups();
    }
  }, [product]);

  // initialize variables state.
  useEffect(() => {
    if (variationGroups && initialVariationState) {
      const result: any = {};

      variationGroups.forEach((group, index) => {
        const groupName = group.name;
        const groupId = group.seq;

        let groupData: any = {
          id: groupId,
          productId: '',
          name: groupName,
          selected: [],
          options: [],
        };

        if (initialVariationState?.isUOM === true) {
          const selectedOption =
            product.item_details.quantity.unitized?.measure;
          groupData.selected = [
            `${selectedOption.value} ${selectedOption.unit}`,
          ];

          product.related_items.map((item: any) => {
            const option = item.item_details.quantity.unitized.measure;
            groupData.options.push(`${option.value} ${option.unit}`);
          });
        } else {
          groupData.selected = [initialVariationState[groupName]];

          if (index === 0) {
            variations.forEach(variation => {
              groupData.productId = variation.id;

              if (!groupData.options.includes(variation[groupName])) {
                groupData.options.push(variation[groupName]);
              }
            });
          } else {
            const prevGroupName = variationGroups[index - 1].name;
            const prevGroupSelection = initialVariationState[prevGroupName];

            variations.forEach(variation => {
              groupData.productId = variation.id;
              if (variation[prevGroupName] === prevGroupSelection) {
                if (!groupData.options.includes(variation[groupName])) {
                  groupData.options.push(variation[groupName]);
                }
              }
            });
          }
        }
        result[groupId] = groupData;
      });

      setVariationState(result);
    }
  }, [variationGroups, initialVariationState, variations]);

  return Object.keys(variationState).map(groupId => {
    const groupData = variationState[groupId];
    const groupName = groupData.name;

    return (
      <>
        <View style={styles.group} key={groupId}>
          <View style={styles.groupHeader}>
            <Text variant="bodyMedium" style={styles.groupTitle}>
              Available {groupName} Options
            </Text>
            {groupName === 'size' && isFashion && (
              <TouchableOpacity
                onPress={() => setOpenSizeChart(true)}
                style={styles.sizeChart}>
                <Text variant={'bodyMedium'} style={styles.sizeGuide}>
                  Size Guide
                </Text>
                <Icon name={'arrow-right'} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.groupOptions}>
            {groupData.options.map((option: any) => {
              const isSelected = groupData.selected.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={
                    isSelected
                      ? styles.selectedCustomization
                      : styles.customization
                  }
                  onPress={() => {
                    if (isUOM) {
                      handleUOMClick(groupData, option);
                    } else {
                      handleVariationClick(groupData, option);
                    }
                  }}>
                  <Text
                    variant="bodyMedium"
                    style={
                      isSelected
                        ? styles.selectedCustomizationLabel
                        : styles.customizationLabel
                    }>
                    {groupName === 'colour'
                      ? COLOR_CODE_TO_NAME[option] || option
                      : option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {openSizeChart && chartImage && (
          <Portal>
            <Dialog
              visible={openSizeChart}
              onDismiss={() => setOpenSizeChart(false)}>
              <Dialog.Title>Size Chart</Dialog.Title>
              <Dialog.Content>
                <FastImage
                  source={{uri: chartImage}}
                  style={styles.chartImage}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setOpenSizeChart(false)}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </>
    );
  });
};

const makeStyles = colors =>
  StyleSheet.create({
    group: {
      marginBottom: 24,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupTitle: {
      textTransform: 'capitalize',
    },
    sizeGuide: {
      color: colors.primary,
      marginRight: 8,
    },
    sizeChart: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
    },
    groupOptions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    selectedCustomization: {
      textTransform: 'capitalize',
      borderWidth: 2,
      borderColor: '#008ECC',
      backgroundColor: '#008ECC',
      borderRadius: 9,
      marginRight: 20,
      padding: 9,
      textAlign: 'center',
      marginBottom: 8,
    },
    customization: {
      textTransform: 'capitalize',
      borderWidth: 2,
      borderColor: '#BEBCBD',
      backgroundColor: '#fff',
      borderRadius: 9,
      marginRight: 20,
      padding: 9,
      textAlign: 'center',
      marginBottom: 8,
    },
    selectedCustomizationLabel: {
      color: 'white',
    },
    customizationLabel: {
      color: '#3C4242',
    },
    chartImage: {
      width: '100%',
      aspectRatio: 1,
    },
  });

export default VariationsRenderer;
