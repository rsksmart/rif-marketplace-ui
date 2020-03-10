import React, { FC } from 'react';

import './MarketPageTemplate.css';
import MarketFilter from 'components/organisms/marketplace/MarketFilter';
import Marketplace from 'components/organisms/marketplace/Marketplace';

export interface MarketPageTemplateProps {
  className: string;
}

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({ className }) => {
  return (
    <div className={`market-page ${className}`}>
      <MarketFilter />
      <Marketplace />
    </div>
  );
};

export default MarketPageTemplate;
