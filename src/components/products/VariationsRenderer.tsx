import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

import {makeGlobalStyles} from '../../styles/styles';
import {useAppTheme} from '../../utils/theme';

interface VariationsRenderer {
  product: any;
  variationState: any;
  setVariationState: (variations: any[]) => void;
  isFashion: boolean;
  openSizeChart?: () => void;
}

const VariationsRenderer: React.FC<VariationsRenderer> = ({
  product,
  variationState,
  setVariationState,
  isFashion = false,
  openSizeChart,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [variationGroups, setVariationGroups] = useState<any[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [initialVariationState, setInitialVariationState] = useState<any>({});
  const [isUOM, setIsUOM] = useState<boolean>(false);
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

  const findMatchingVariation = (updatedVariationState: any) => {
    // Iterate through variations
    for (const variation of variations) {
      let isMatch = true;

      // Iterate through variationState
      for (const groupId in updatedVariationState) {
        if (updatedVariationState.hasOwnProperty(groupId)) {
          const groupData = updatedVariationState[groupId];
          const groupName = groupData.name;
          const selectedOption = groupData.selected[0];

          // Check if the variation matches the values in variationState
          if (variation[groupName] !== selectedOption) {
            isMatch = false;
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
    try {
      let updatedVariationState = { ...variationState };
      groupData.selected = [option];
      updatedVariationState[groupData.id] = groupData;
      const isLastGroup = groupData.id === Object.keys(variationState).length;
      if (!isLastGroup) {
        const lastGroupId = Object.keys(variationState).length;
        updatedVariationState[lastGroupId].selected = [];
      }

      variationGroups.forEach((group, index) => {
        const groupName = group.name;
        const groupId = group.seq;

        const selectionOption = updatedVariationState[index + 1].selected[0];
        const newGroupData: any = {
          id: groupId,
          name: groupName,
          selected: selectionOption ? [selectionOption] : [],
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
            if (variation[prevGroupName] === prevGroupSelection) {
              if (!newGroupData.options.includes(variation[groupName])) {
                newGroupData.options.push(variation[groupName]);
              }
            }
          });
        }

        if (newGroupData.selected.length === 0) {
          newGroupData.selected = [newGroupData.options[0]];
        }
        updatedVariationState[groupId] = newGroupData;
      });

      setVariationState(updatedVariationState);

      const matchingVariation = findMatchingVariation(updatedVariationState);
      if (matchingVariation) {
        navigation.navigate('ProductDetails', {
          productId: matchingVariation.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
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
      <View style={styles.group} key={groupId}>
        <View style={styles.groupHeader}>
          <Text variant="bodyLarge" style={styles.groupTitle}>
            {t('Variations.Available Options', {groupName})}
          </Text>
          {groupName === 'size' && isFashion && (
            <TouchableOpacity onPress={openSizeChart} style={styles.sizeChart}>
              <Text variant={'bodyMedium'} style={styles.sizeGuide}>
                {t('Variations.Size Guide')}
              </Text>
              <Icon name={'arrow-right'} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.groupOptions}>
          <FlatList
            data={groupData.options}
            renderItem={({item}: {item: any}) => {
              const isSelected = groupData.selected.includes(item);
              if (groupName === 'colour') {
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.dotContainer,
                      isSelected ? styles.selectedDotContainer : {},
                    ]}
                    onPress={() => {
                      if (isUOM) {
                        handleUOMClick(groupData, item);
                      } else {
                        handleVariationClick(groupData, item);
                      }
                    }}>
                    <View style={[styles.colorDot, {backgroundColor: item}]} />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      isSelected
                        ? globalStyles.containedButton
                        : styles.outlineButton,
                      styles.customization,
                    ]}
                    onPress={() => {
                      if (isUOM) {
                        handleUOMClick(groupData, item);
                      } else {
                        handleVariationClick(groupData, item);
                      }
                    }}>
                    <Text
                      variant="bodyLarge"
                      style={
                        isSelected
                          ? globalStyles.containedButtonText
                          : styles.outlineButtonText
                      }>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
            horizontal
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  });
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    group: {
      marginTop: 20,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupTitle: {
      textTransform: 'capitalize',
      color: colors.neutral400,
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
      marginTop: 12,
    },
    customization: {
      textTransform: 'capitalize',
      borderRadius: 8,
      borderWidth: 1,
      marginRight: 20,
      padding: 10,
      textAlign: 'center',
    },
    outlineButton: {
      borderWidth: 2,
      borderColor: colors.neutral200,
    },
    dotContainer: {
      borderWidth: 2,
      borderColor: colors.neutral200,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
    },
    selectedDotContainer: {
      borderColor: colors.primary,
    },
    outlineButtonText: {
      color: colors.neutral400,
    },
    colorDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
  });

export default VariationsRenderer;
