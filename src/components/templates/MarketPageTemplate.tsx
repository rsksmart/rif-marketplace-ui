import MarketFilter from 'components/templates/marketplace/MarketFilter';
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace';
import { MarketItemType, MarketListingTypes } from 'models/Market';
import React, { FC } from 'react';

// TODO: use MaterialUI classes
import './MarketPageTemplate.css';


export interface MarketPageTemplateProps {
  className: string;
  listingType: MarketListingTypes;
  filterItems: React.ReactNode;
  itemCollection: MarketItemType[];
  headers: TableHeaders;
}

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  listingType,
  filterItems,
  itemCollection,
  headers,
}) => {
  return (
    <div className={`market-page ${className}`}>
      <MarketFilter listingType={listingType}>{filterItems}</MarketFilter>
      <Marketplace items={itemCollection} headers={headers} />
    </div>
  );
};

export default MarketPageTemplate;
