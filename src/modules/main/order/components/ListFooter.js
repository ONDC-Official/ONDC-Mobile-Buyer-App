import React from 'react';

import OrderCardSkeleton from './OrderCardSkeleton';

/**
 * Component to show order history skeleton until user gets requested data
 * @param moreRequested:prop indicates request is in progress
 * @constructor
 * @returns {JSX.Element}
 */
const ListFooter = ({moreRequested}) =>
  moreRequested ? <OrderCardSkeleton/> : null;

export default ListFooter;
