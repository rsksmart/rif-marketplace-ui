import React, { useContext, useEffect } from 'react';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import MarketStore from 'store/Market/MarketStore';
import { DomainItemType } from 'models/marketItems/DomainItem';
import { useMarketUtils } from 'store/Market/marketStoreUtils';
import { MarketListingType } from 'models/Market';
import { MARKET_ACTIONS } from 'store/Market/marketActions';

const DomainsPage = () => {
  const {
    state: {
      MarketState: {
        listings: { domainListing },
        metadata: {
          domain: { lastUpdated },
        },
      },
      AppState: { isLoading },
    },
    dispatch,
  } = useContext(MarketStore);
  const { fetchListingItems } = useMarketUtils(dispatch);

  useEffect(() => {
    if (lastUpdated < 0 && !isLoading) {
      (async () => {
        const { marketItems } = await fetchListingItems(
          MarketListingType.domainListing,
        );

        dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingType.domainListing,
            items: marketItems,
          },
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated, isLoading]);

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
