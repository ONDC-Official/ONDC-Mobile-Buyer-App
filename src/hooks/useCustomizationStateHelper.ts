import {useEffect, useState} from 'react';

export default () => {
  const [customizationState, setCustomizationState] = useState<any>({});
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);

  useEffect(() => {
    let totalPrice = 0;
    const calculateSubtotal = (groupId: any, state: any) => {
      let group = state[groupId];
      if (!group) {
        return;
      }

      let prices = group.selected.map(
        (selectedGroup: any) => selectedGroup.price,
      );
      totalPrice =
        totalPrice + prices.reduce((a: number, b: number) => a + b, 0);
      setCustomizationPrices(totalPrice);

      group?.childs?.map((child: any) => {
        calculateSubtotal(child, state);
      });
    };

    if (customizationState && customizationState.firstGroup) {
      totalPrice = 0;
      setCustomizationPrices(0);
      calculateSubtotal(customizationState.firstGroup?.id, customizationState);
    }
  }, [customizationState]);

  return {
    customizationState,
    setCustomizationState,
    customizationPrices,
  };
};
