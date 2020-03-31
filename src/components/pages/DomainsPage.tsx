import PriceItem from 'components/atoms/PriceItem';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingType } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { useMarketUtils } from 'store/Market/marketStoreUtils';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router';

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
  const history = useHistory()

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

  // TODO: extract (possibly into action)
  const headers = {
    domain: 'Name',
    seller: 'Seller',
    expirationDate: 'Renewal Date',
    price: 'Price',
    actionCol_1: ''
  }

  const collection = domainListing.map(domainItem => {
    const { _id, seller, price, price_fiat, currency, domain } = domainItem;

    const PriceCell = (
      <>
        <PriceItem key='hola' type='crypto' price={price} currency={currency} />
        {' = '}
        <PriceItem type='fiat' price={price_fiat} currency='USD' />
      </>
    )

    domainItem.price = PriceCell

    const actionCol_1 = (seller === '38EA6CED3289A2AA554986C7662F58F0')
      ? React.createElement('div', {}, 'TODO')
      : <SelectRowButton
        id={_id}
        handleSelect={() => {
          dispatch({
            type: MARKET_ACTIONS.SET_BUY_ITEM,
            payload: {
              listingType: MarketListingType.domainListing,
              item: domainItem
            }
          })
          history.push(ROUTES.CHECKOUT.DOMAINS)
        }}
      />
    domainItem.actionCol_1 = actionCol_1;

    return domainItem;
  })
  // End of extract block

  return (
    <MarketPageTemplate
      className="Domains"
      filters={[]}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsPage;
