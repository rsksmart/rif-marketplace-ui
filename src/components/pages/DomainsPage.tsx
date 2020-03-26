import React from 'react';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';

const DomainsPage = () => {
  
  const filters = [];
  const data = { headers: [], content: [] };

  return (
    <MarketPageTemplate className="Domains" filters={filters} data={data} />
  );
};

export default DomainsPage;
