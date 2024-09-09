import React, {useEffect, useMemo, useState} from 'react';
import {createCustomizationAndGroupMapping} from '../../../../utils/utils';
import CustomizationGroup from './CustomizationGroup';
import {
  formatCustomizationGroups,
  formatCustomizations,
} from '../../../../utils/utils';

interface FBProductCustomization {
  product: any;
  customizationState: any;
  setCustomizationState: (state: any) => void;
  isEditFlow?: boolean;
  setItemOutOfStock: (flag: boolean) => void;
  hideProductDetails?: boolean;
}

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

const FBProductCustomization: React.FC<FBProductCustomization> = ({
  product,
  customizationState,
  setCustomizationState,
  isEditFlow = false,
  setItemOutOfStock,
}) => {
  const [customizationGroups, setCustomizationGroups] = useState<any[]>([]);
  const [customizations, setCustomizations] = useState<any[]>([]);

  const [customizationToGroupMap, setCustomizationToGroupMap] = useState<any>(
    {},
  );

  useEffect(() => {
    if (product) {
      const {customisation_groups, customisation_items} = product;
      const customGroup = product?.item_details?.tags?.find(
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

      const processCustomizationGroup = (id: any) => {
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
            processCustomizationGroup(childGroup);
          }
        }
      };

      if (firstGroup) {
        processCustomizationGroup(firstGroup.id);
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
      type: currentGroup.maxQuantity > 1 ? 'Checkbox' : 'Radio',
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

  const initialGroup = useMemo(() => {
    const lowestSequence = findMinMaxSeq(customizationGroups).minSeq;
    return customizationGroups.find(group => group.seq === lowestSequence);
  }, [customizationGroups]);

  return (
    <CustomizationGroup
      group={customizationState[initialGroup?.id]}
      customizationState={customizationState}
      customizationGroups={customizationGroups}
      handleClick={handleClick}
    />
  );
};

export default FBProductCustomization;
