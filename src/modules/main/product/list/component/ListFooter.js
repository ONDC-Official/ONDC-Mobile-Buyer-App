import React from 'react';

import ProductCardSkeleton from './ProductCardSkeleton';

const ListFooter = ({moreRequested}) => {
  return moreRequested ? <ProductCardSkeleton /> : null;
};

export default ListFooter;
