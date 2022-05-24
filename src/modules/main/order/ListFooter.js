import React from 'react';
import OrderCardSkeleton from './OrderCardSkeleton';

const ListFooter = ({moreRequested}) => {
  return moreRequested ? <OrderCardSkeleton/> : null;
};

export default ListFooter;
