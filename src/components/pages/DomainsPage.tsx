import React, { useContext } from 'react';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import AppStore from 'store/App/AppStore';

const DomainsPage = () => {
  // const { state } = useContext(AppStore);

  // const filters = state.filters;
  // const data = state.data;

  const filters = [];
  const data = { headers: [], content: [] };

  return (
    <MarketPageTemplate className="Domains" filters={filters} data={data} />
  );
};

export default DomainsPage;
