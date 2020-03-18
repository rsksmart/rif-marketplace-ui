import React, { FC } from 'react';

import './MarketPageTemplate.css';
import MarketFilter from 'components/organisms/marketplace/MarketFilter';
import Marketplace from 'components/organisms/marketplace/Marketplace';
import { MarketData } from 'models/Market';

export interface MarketPageTemplateProps {
  className: string;
  filters: {}[];
  data: MarketData;
}

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filters,
  data,
}) => {
  return (
    <div className={`market-page ${className}`}>
      <MarketFilter filters={filters} />
      <Marketplace data={data} />
    </div>
  );
};

export default MarketPageTemplate;
