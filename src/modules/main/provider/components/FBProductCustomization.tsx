import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Checkbox, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {createCustomizationAndGroupMapping} from '../../../../utils/utils';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';

interface FBProductCustomization {
  product: any;
  customizationState: any;
  setCustomizationState: (state: any) => void;
  isEditFlow?: boolean;
  setItemOutOfStock: (flag: boolean) => void;
  hideProductDetails?: boolean;
}

export const formatCustomizationGroups = (groups: any) => {
  return groups?.map((group: any) => {
    let minConfig, maxConfig, inputTypeConfig, seqConfig;

    group.tags.forEach((tag: any) => {
      if (tag.code === 'config') {
        tag.list.forEach((one: any) => {
          if (one.code === 'min') {
            minConfig = one.value;
          }
          if (one.code === 'max') {
            maxConfig = one.value;
          }
          if (one.code === 'input') {
            inputTypeConfig = one.value;
          }
          if (one.code === 'seq') {
            seqConfig = one.value;
          }
        });
      }
    });

    const customization: any = {
      id: group.local_id,
      name: group.descriptor.name,
      inputType: inputTypeConfig,
      minQuantity: Number(minConfig),
      maxQuantity: Number(maxConfig),
      seq: Number(seqConfig),
    };

    if (inputTypeConfig === 'input') {
      customization.special_instructions = '';
    }

    return customization;
  });
};

export const formatCustomizations = (items: any) => {
  return items?.map((customization: any) => {
    let parent = null;
    let isDefault = false;
    let childs: any[] = [];
    let child = null;
    let vegNonVegTag = null;

    customization.item_details.tags.forEach((tag: any) => {
      if (tag.code === 'parent') {
        tag.list.forEach((one: any) => {
          if (one.code === 'default') {
            isDefault = one.value.toLowerCase() === 'yes';
          } else if (one.code === 'id') {
            parent = one.value;
          }
        });
      } else if (tag.code === 'child') {
        tag.list.forEach((item: any) => {
          childs.push(item.value);
          if (item.code === 'id') {
            child = item.value;
          }
        });
      } else if (tag.code === 'veg_nonveg') {
        vegNonVegTag = tag;
      }
    });

    return {
      id: customization.item_details.id,
      name: customization.item_details.descriptor.name,
      price: customization.item_details.price.value,
      inStock: customization.item_details.quantity.available.count > 0,
      parent,
      child,
      childs: childs?.length > 0 ? childs : null,
      isDefault: isDefault,
      vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : '',
    };
  });
};

const findMinMaxSeq = (customizationGroups: any) => {
  if (!customizationGroups || customizationGroups.length === 0) {
    return {minSeq: undefined, maxSeq: undefined};
  }

  let minSeq = Infinity;
  let maxSeq = -Infinity;

  customizationGroups.forEach((group: any) => {
    const seq = group.seq;
    if (seq < minSeq) {
      minSeq = seq;
    }
    if (seq > maxSeq) {
      maxSeq = seq;
    }
  });

  return {minSeq, maxSeq};
};

const VegNonVegTag = ({category = 'veg'}) => {
  return (
    <FastImage
      source={
        category === 'veg'
          ? require('../../../../assets/veg.png')
          : require('../../../../assets/non_veg.png')
      }
      style={{width: 18, height: 18}}
    />
  );
};

const FBProductCustomization: React.FC<FBProductCustomization> = ({
  product,
  customizationState,
  setCustomizationState,
  isEditFlow = false,
  setItemOutOfStock,
  hideProductDetails = false,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [customizationGroups, setCustomizationGroups] = useState<any[]>([]);
  const [customizations, setCustomizations] = useState<any[]>([]);

  const [customizationToGroupMap, setCustomizationToGroupMap] = useState<any>(
    {},
  );

  useEffect(() => {
    if (product) {
      const {customisation_groups, customisation_items} = product;
      const customGroup = product.item_details.tags.find(
        (item: any) => item.code === 'custom_group',
      );
      if (customGroup && customGroup.list.length > 0) {
        setCustomizationGroups(formatCustomizationGroups(customisation_groups));
      } else {
        setCustomizationGroups([]);
      }
      setCustomizations(formatCustomizations(customisation_items));
    }
  }, [product]);

  useEffect(() => {
    const mappings = createCustomizationAndGroupMapping(customizations);
    setCustomizationToGroupMap(mappings.customizationToGroupMap);
  }, [customizationGroups, customizations]);

  useEffect(() => {
    const initializeCustomizationState = () => {
      const minSeq = findMinMaxSeq(customizationGroups).minSeq;
      const firstGroup = customizationGroups.find(
        (group: any) => group.seq === minSeq,
      );
      const state: any = {firstGroup};

      const processGroup = (id: any) => {
        const group: any = customizationGroups.find(item => item.id === id);
        if (!group) {
          return;
        }
        const groupId = group.id;
        const groupName = group.name;
        const isMandatory = group.minQuantity > 0;

        state[groupId] = {
          id: groupId,
          name: groupName,
          seq: group.seq,
          options: [],
          selected: [],
          childs: [],
          isMandatory,
          type: group.maxQuantity > 1 ? 'Checkbox' : 'Radio',
        };

        const childCustomizations = customizations.filter(
          (customization: any) => customization.parent === groupId,
        );

        state[groupId].options = childCustomizations;
        state[groupId].selected = findSelectedCustomizationForGroup(
          state[groupId],
          childCustomizations,
        );

        let childGroups: any =
          state[groupId].selected[0]?.id != undefined
            ? customizationToGroupMap[state[groupId].selected[0]?.id]
            : [];
        state[groupId].childs = childGroups;

        if (childGroups) {
          for (const childGroup of childGroups) {
            processGroup(childGroup);
          }
        }
      };

      if (firstGroup) {
        processGroup(firstGroup.id);
        setCustomizationState(state);
      }
    };

    if (!isEditFlow) {
      initializeCustomizationState();
    }
  }, [customizationGroups, customizations, customizationToGroupMap]);

  const findSelectedCustomizationForGroup = (
    group: any,
    childCustomizations: any,
  ) => {
    if (!group.isMandatory) {
      return [];
    }
    let selected_groups = [];
    let defaultCustomization = childCustomizations.filter(
      (customization: any) => customization.isDefault && customization.inStock,
    );

    if (defaultCustomization.length) {
      selected_groups = defaultCustomization;
    } else {
      const x = childCustomizations.find(
        (customization: any) => customization.inStock,
      );
      selected_groups = x ? [x] : [];
    }

    let is_item_out_of_stock = true;
    if (selected_groups.length) {
      is_item_out_of_stock = false;
    }

    setItemOutOfStock(is_item_out_of_stock);
    return selected_groups;
  };

  const processGroup = (
    groupId: any,
    updatedCustomizationState1: any,
    selectedGroup: any,
    selectedOption: any,
  ) => {
    const currentGroup = customizationGroups.find(item => item.id === groupId);
    if (!currentGroup) {
      return;
    }

    const groupName = currentGroup.name;
    const isMandatory = currentGroup.minQuantity > 0;

    const currentGroupOldState = updatedCustomizationState1[currentGroup.id];

    updatedCustomizationState1[groupId] = {
      id: groupId,
      name: groupName,
      seq: currentGroup.seq,
      options: [],
      selected: [],
      childs: [],
      isMandatory,
      type: 'Checkbox',
    };
    updatedCustomizationState1[groupId].options = [];

    const childCustomizations = customizations.filter(
      customization => customization.parent === groupId,
    );
    updatedCustomizationState1[groupId].options = childCustomizations;

    let childGroups = [];
    if (currentGroup.id === selectedGroup.id) {
      let new_selected_options = [];
      // if option is there then remove it here
      if (
        !isMandatory &&
        currentGroupOldState.selected.find(
          (optn: any) => optn.id === selectedOption.id,
        )
      ) {
        new_selected_options = [...currentGroupOldState.selected].filter(
          (item: any) => item.id !== selectedOption.id,
        );
        updatedCustomizationState1[groupId].selected = new_selected_options;
      } else {
        // if option is not there then add it only if length is less than max Qty
        if (currentGroup.maxQuantity === 1) {
          childGroups = customizationToGroupMap[selectedOption.id];
          updatedCustomizationState1[groupId].selected = [selectedOption];
        } else {
          if (
            currentGroup.maxQuantity > 1 &&
            currentGroupOldState.selected.length < currentGroup.maxQuantity
          ) {
            new_selected_options = [
              ...currentGroupOldState.selected,
              selectedOption,
            ];
            updatedCustomizationState1[groupId].selected = new_selected_options;
          } else {
            updatedCustomizationState1[groupId].selected =
              currentGroupOldState.selected;
          }
        }
      }

      updatedCustomizationState1[groupId].childs = childGroups;
    } else {
      const selectedCustomization = findSelectedCustomizationForGroup(
        updatedCustomizationState1[groupId],
        childCustomizations,
      );

      updatedCustomizationState1[groupId].selected = selectedCustomization;

      if (selectedCustomization.length) {
        childGroups = customizationToGroupMap[selectedCustomization[0].id];
        updatedCustomizationState1[groupId].childs = childGroups;
      }
    }

    // Recursively process child groups
    for (const childGroup of childGroups) {
      processGroup(
        childGroup,
        updatedCustomizationState1,
        selectedGroup,
        selectedOption,
      );
    }

    return updatedCustomizationState1;
  };

  const handleClick = (group: any, selectedOption: any) => {
    let updatedCustomizationState = {...customizationState};
    let updatedState = processGroup(
      group.id,
      updatedCustomizationState,
      group,
      selectedOption,
    );
    setCustomizationState(updatedState);
  };

  const renderGroups = (group: any) => {
    if (!group) {
      return <></>;
    }
    const groupDetails = customizationState[group?.id];

    return (
      <View key={groupDetails?.id} style={styles.filterContainer}>
        <Text variant={'bodyLarge'} style={styles.groupName}>
          {groupDetails?.name}
        </Text>
        <View style={styles.groupContainer}>
          {groupDetails?.options?.map((option: any) => {
            const selected =
              groupDetails?.selected?.some(
                (selectedOption: any) => selectedOption?.id === option?.id,
              ) ?? false;

            return (
              <View key={option.id} style={styles.optionContainer}>
                <View style={styles.meta}>
                  <VegNonVegTag category={option.vegNonVeg} />
                  <Text variant={'bodyMedium'} style={styles.option}>
                    {option.name}
                  </Text>
                </View>
                <View style={styles.optionActionContainer}>
                  {option.inStock ? (
                    <View style={styles.optionActionContainer}>
                      <Text variant={'bodyLarge'} style={styles.option}>
                        ₹ {option.price}
                      </Text>
                      <Checkbox.Android
                        status={selected ? 'checked' : 'unchecked'}
                        onPress={() => {
                          if (option.inStock) {
                            handleClick(groupDetails, option);
                          }
                        }}
                      />
                    </View>
                  ) : (
                    <Text variant={'bodyMedium'} style={styles.outOfStock}>
                      Out of Stock
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        {groupDetails?.childs &&
          groupDetails?.childs.map((child: any) =>
            renderGroups(customizationState[child]),
          )}
      </View>
    );
  };

  const minSeq = findMinMaxSeq(customizationGroups).minSeq;
  const firstGroup = customizationGroups.find(group => group.seq === minSeq);

  return (
    <View>
      {!hideProductDetails && (
        <View style={styles.header}>
          <Text variant={'titleSmall'}>
            {product?.item_details?.descriptor?.name}
          </Text>
          <Text variant={'titleMedium'}>
            {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}{' '}
            {product?.item_details?.price?.value}
          </Text>
        </View>
      )}
      {renderGroups(firstGroup)}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterContainer: {
      marginBottom: 24,
    },
    optionContainer: {
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionActionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    option: {
      color: '#222',
      paddingLeft: 8,
    },
    outOfStock: {
      color: colors.error,
    },
    groupName: {
      color: '#1D1D1D',
      marginBottom: 13,
      marginTop: 20,
    },
    groupContainer: {
      backgroundColor: '#F3F9FE',
      borderRadius: 2,
      padding: 16,
    },
    header: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export default FBProductCustomization;
