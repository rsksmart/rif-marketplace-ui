import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainsFilters from 'components/organisms/DomainsFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import AppStore from 'store/App/AppStore';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { useMarketUtils } from 'store/Market/marketStoreUtils';

const DomainsPage = () => {
  const {
    state: {
      listings: { domainListing },
      filters,
      metadata: {
        domainListing: { lastUpdated },
      },
    },
    dispatch,
  } = useContext(MarketStore);
  const { state: { isLoading } } = useContext(AppStore)
  const { fetchListingItems } = useMarketUtils(dispatch);
  const history = useHistory()
  const currentFilters = filters.domainListing;

  useEffect(() => {
    if (lastUpdated < 0 && !isLoading) {
      fetchListingItems(
        MarketListingTypes.domainListing,
        currentFilters
      ).then(items => {
        items && dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingTypes.domainListing,
            items,
          },
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated, isLoading, currentFilters]);

  useEffect(() => {
    (async () => {
      const items = await fetchListingItems(
        MarketListingTypes.domainListing,
        currentFilters
      );

      dispatch({
        type: MARKET_ACTIONS.SET_ITEMS,
        payload: {
          listingType: MarketListingTypes.domainListing,
          items,
        },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilters]);

  // TODO: extract (possibly into action)
  const headers = {
    sellerDomain: 'Name',
    sellerAddress: 'Seller',
    expirationDatetime: 'Renewal Date',
    combinedPrice: 'Price',
    actionCol_1: ''
  }

  const collection = domainListing.map(domainItem => {
    const { _id, seller, price, price_fiat, paymentToken, expirationDate } = domainItem;

    const priceCellProps = { price, price_fiat, currency: paymentToken, currency_fiat: 'USD', divider: ' = ' };
    domainItem.combinedPrice = <CombinedPriceCell {...priceCellProps} />

    const actionCol_1 = (seller === '38EA6CED3289A2AA554986C7662F58F0')
      ? React.createElement('div', {}, 'TODO')
      : <SelectRowButton
        id={_id}
        handleSelect={() => {
          dispatch({
            type: MARKET_ACTIONS.SET_BUY_ITEM,
            payload: {
              listingType: MarketListingTypes.domainListing,
              item: domainItem,
              txType: 'buy'
            }
          })
          history.push(ROUTES.CHECKOUT.DOMAINS)
        }}
      />
    domainItem.actionCol_1 = actionCol_1;


    domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

    return domainItem;
  })
  // End of extract block

  return (
    <MarketPageTemplate
      className="Domains"
      listingType={MarketListingTypes.domainListing}
      filterItems={<DomainsFilters />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsPage;