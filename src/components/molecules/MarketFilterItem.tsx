import React, { FC } from 'react';

export interface MarketFilterProps {
  name: string;
}

const MarketFilterItem: FC<MarketFilterProps> = ({ name = '', children }) => {
  return <div className={`market-filter-item ${name}`}>{children}</div>;
};

export default MarketFilterItem;
