import { createDomainService, DOMAINS_SERVICE_PATHS, fetchDomains } from 'api/rif-marketplace-cache/domainsController';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainFilters from 'components/organisms/filters/DomainFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Web3Store } from '@rsksmart/rif-ui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';

const LISTING_TYPE = MarketListingTypes.DOMAINS;
const TX_TYPE = TxType.SELL;

const MyDomainsPage = () => {
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
    if (servicePath && account && servicePath !== DOMAINS_SERVICE_PATHS.SELL(account)) {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SELL
        }
      })
    }
  }, [servicePath, account, dispatch])
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
  }, [servicePath, account, dispatch])

  useEffect(() => {
    if (servicePath && account && servicePath === DOMAINS_SERVICE_PATHS.SELL(account))
      fetchDomains(domainFilters)
        .then(items => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: LISTING_TYPE,
            items,
          },
        }));
  }, [domainFilters, account, servicePath, dispatch]);

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
          history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
        }}
      />;
      domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

      return domainItem;
    })

  return (
    <MarketPageTemplate
      className="Domains"
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers}
      accountRequired
    />
  );
};

export default MyDomainsPage;