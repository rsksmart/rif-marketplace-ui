import { createOffersService, fetchDomainOffers } from 'api/rif-marketplace-cache/domainsController';
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

const DomainsBuyPage = () => {
  const {
    state: {
      currentListing: {
        servicePath,
        items: offers,
      },
      filters: {
        domainOffers: offerFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore);
  const history = useHistory()

  /* Initialise */
  useEffect(() => {
    if (!servicePath) {
      const serviceAddr = createOffersService();
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: MarketListingTypes.DOMAIN_OFFERS,
        }
      })
    }
  }, [servicePath])

  useEffect(() => {
    if (servicePath)
      fetchDomainOffers(offerFilters)
        .then(items => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingTypes.DOMAINS,
            items,
          },
        }));
  }, [offerFilters, servicePath]);

  const headers = {
    domainName: 'Name',
    sellerAddress: 'Seller',
    expirationDatetime: 'Renewal Date',
    combinedPrice: 'Price',
    actionCol_1: ''
  }

  const collection = offers
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
          dispatch({
            type: MARKET_ACTIONS.SELECT_ITEM,
            payload: {
              listingType: MarketListingTypes.DOMAINS,
              item: domainItem,
              txType: TxType.BUY
            }
          })
          history.push(ROUTES.CHECKOUT.DOMAINS)
        }}
      />;
      domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

      return domainItem;
    })

  return (
    <MarketPageTemplate
      className="Domains"
      listingType={MarketListingTypes.DOMAINS}
      filterItems={<DomainsFilters txType={TxType.BUY} />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsBuyPage;