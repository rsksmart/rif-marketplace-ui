import React from 'react';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import MarketStore from 'store/Market/MarketStore';
import { DomainItemType } from 'models/Market';

const DomainsPage = () => {
  const {
    state: {
      MarketState: {
        listings: { domainListing },
      },
    },
  } = useContext(MarketStore);

  const nullItem: Omit<DomainItemType, '_id'> = {
    // TODO: remove from here
    currency: '',
    domain: '',
    price: -1,
    price_usd: -1,
    tld: '',
    user: '',
  };
  const headers = Object.keys(nullItem);

  return (
    <MarketPageTemplate
      className="Domains"
      filters={[]}
      itemCollection={domainListing}
      headers={headers}
    />
  );
};

export default DomainsPage;
