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

const DomainsSellPage = () => {
  const {
    state: {
      currentListing: {
        servicePath,
        items: domains,
      },
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

  /* Initialise */
  useEffect(() => {
    if (!servicePath && account) {
      const serviceAddr = createDomainService(account);
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: MarketListingTypes.DOMAINS,
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
            listingType: MarketListingTypes.DOMAINS,
            items,
          },
        }));
  }, [domainFilters, servicePath]);

  const headers = {
    name: 'Name',
    expirationDatetime: 'Renewal Date',
    actionCol_1: ''
  }

  const collection = domains
    .map(domainItem => {
      const { _id, expirationDate } = domainItem;

      domainItem.actionCol_1 = <SelectRowButton
        id={_id}
        handleSelect={() => {
          dispatch({
            type: MARKET_ACTIONS.SELECT_ITEM,
            payload: {
              listingType: MarketListingTypes.DOMAINS,
              item: domainItem,
              txType: TxType.SELL
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
      filterItems={<DomainsFilters txType={TxType.SELL} />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsSellPage;