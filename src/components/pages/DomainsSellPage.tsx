import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainsFilters from 'components/organisms/DomainsFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { useMarketUtils } from 'store/Market/marketStoreUtils';

const DomainsSellPage = () => {
  const {
    state: {
      listings: { domainListing },
      filters: {
        domainListing: currentFilters,
      },
    },
    dispatch: marketDispatch,
  } = useContext(MarketStore);
  const { fetchListingItems } = useMarketUtils(marketDispatch);
  const history = useHistory()

  useEffect(() => {
    fetchListingItems(
      MarketListingTypes.domainListing,
      TxType.LIST,
      currentFilters
    ).then(items => marketDispatch({
      type: MARKET_ACTIONS.SET_ITEMS,
      payload: {
        listingType: MarketListingTypes.domainListing,
        items,
      },
    }));
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

  const collection = domainListing
    .map(domainItem => {
      const { _id, price, price_fiat, paymentToken, expirationDate } = domainItem;

      domainItem.combinedPrice = <CombinedPriceCell
        price={price}
        price_fiat={price_fiat}
        currency={paymentToken}
        currency_fiat='USD'
        divider=' = '
      />
      domainItem.actionCol_1 = <SelectRowButton
        id={_id}
        handleSelect={() => {
          marketDispatch({
            type: MARKET_ACTIONS.SET_BUY_ITEM,
            payload: {
              listingType: MarketListingTypes.domainListing,
              item: domainItem,
              txType: TxType.LIST
            }
          })
          history.push(ROUTES.CHECKOUT.DOMAINS)
        }}
      />;
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

export default DomainsSellPage;