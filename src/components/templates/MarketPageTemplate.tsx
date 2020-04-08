import React, { FC } from 'react';

// TODO: use MaterialUI classes
import './MarketPageTemplate.css';
import MarketFilter from 'components/organisms/marketplace/MarketFilter';
import Marketplace from 'components/organisms/marketplace/Marketplace';
import { MarketItemType } from 'models/Market';

export interface MarketPageTemplateProps {
  className: string;
  filters: {}[];
  itemCollection: MarketItemType[];
  headers: string[];
}

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filters,
  itemCollection,
  headers,
}) => {
  return (
    <div className={`market-page ${className}`}>
      <MarketFilter filters={filters} />
      <Marketplace items={itemCollection} headers={headers} />
    </div>
  );
};

export default MarketPageTemplate;
