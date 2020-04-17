import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainsFilters from 'components/organisms/DomainsFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Web3Store } from 'rifui/providers/Web3Provider';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { createService } from 'api/rif-marketplace-cache/cacheController';
import { createDomainService, fetchDomains } from 'api/rif-marketplace-cache/domainsController';

const LISTING_TYPE = MarketListingTypes.DOMAINS;
const TX_TYPE = TxType.SELL;

const DomainsSellPage = () => {
  const {
    state: {
      currentListing,
      filters: {
        domains: domainFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore);
  const {
    state: { account },
  } = useContext(Web3Store);
  const history = useHistory()

  const servicePath = currentListing?.servicePath;

  /* Initialise */
  useEffect(() => {
    if (!servicePath && account) {
      const serviceAddr = createDomainService(account);
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TX_TYPE,
        }
      })
    }
  }, [servicePath, account])

  useEffect(() => {
    if (servicePath)
      fetchDomains(domainFilters)
        .then(items => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: LISTING_TYPE,
            items,
          },
        }));
  }, [domainFilters, servicePath]);

  if (!currentListing) return null;

  const headers = {
    name: 'Name',
    expirationDatetime: 'Renewal Date',
    actionCol_1: ''
  }

  const collection = currentListing?.items
    .map(domainItem => {
      const { _id, expirationDate } = domainItem;

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
          history.push(ROUTES.CHECKOUT.DOMAINS)
        }}
      />;
      domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

      return domainItem;
    })

  return (
    <MarketPageTemplate
      className="Domains"
      listingType={LISTING_TYPE}
      filterItems={<DomainsFilters txType={TX_TYPE} />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsSellPage;