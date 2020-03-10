import React, { FC } from 'react';

export interface MarketplaceProps {
  className?: string;
}

const Marketplace: FC<MarketplaceProps> = ({ className = '' }) => {
  return <div className={'marketplace ' + className}></div>;
};

export default Marketplace;
