import { createOffersService, fetchDomainOffers } from 'api/rif-marketplace-cache/domainsController';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';

const LISTING_TYPE = MarketListingTypes.DOMAIN_OFFERS;
const TX_TYPE = TxType.BUY;

const DomainsBuyPage = () => {
  const {
    state: {
      currentListing,
      filters: {
        domainOffers: offerFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore);
  const history = useHistory()

  const servicePath = currentListing?.servicePath;

  /* Initialise */
  useEffect(() => {
    if (!servicePath) {
      const serviceAddr = createOffersService();
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TX_TYPE,
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
            listingType: LISTING_TYPE,
            items,
          },
        }));
  }, [offerFilters, servicePath]);

  if (!currentListing) return null;

  const headers = {
    domainName: 'Name',
    sellerAddress: 'Seller',
    expirationDatetime: 'Renewal Date',
    combinedPrice: 'Price',
    actionCol_1: ''
  }

  const collection = currentListing?.items
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
              listingType: LISTING_TYPE,
              item: domainItem,
              txType: TX_TYPE
            }
          })
          history.push(ROUTES.CHECKOUT.DOMAIN_OFFERS)
        }}
      />;
      domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

      return domainItem;
    })

  return (
    <MarketPageTemplate
      className="Domain Offers"
      filterItems={<DomainOfferFilters />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsBuyPage;