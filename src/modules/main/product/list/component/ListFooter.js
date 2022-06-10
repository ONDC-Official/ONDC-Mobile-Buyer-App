import React from 'react';

import ProductCardSkeleton from './ProductCardSkeleton';

/**
 * Component to show product card skeleton until user gets requested data
 * @param moreRequested:prop indicates request is in progress
 * @constructor
 * @returns {JSX.Element}
 */
const ListFooter = ({moreRequested}) => {
  return moreRequested ? <ProductCardSkeleton/> : null;
};

export default ListFooter;
