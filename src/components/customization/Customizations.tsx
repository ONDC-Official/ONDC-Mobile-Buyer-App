import {Text} from 'react-native-paper';
import React from 'react';

const Customizations = ({cartItem}) => {
  if (cartItem.item.customisations) {
    const customisations = cartItem.item.customisations;

    return (
      <Text variant={'labelSmall'}>
        {customisations.map((customization: any, index: number) => {
          const isLastItem = index === customisations.length - 1;
          return `${customization.item_details.descriptor.name} (₹${
            customization.item_details.price.value
          })${isLastItem ? '' : ' + '}`;
        })}
      </Text>
    );
  }

  return <></>;
};

export default Customizations;
