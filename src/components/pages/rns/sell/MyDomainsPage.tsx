import { createDomainService, DOMAINS_SERVICE_PATHS, fetchDomains } from 'api/rif-marketplace-cache/domainsController';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainFilters from 'components/organisms/filters/DomainFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { FC, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Web3Store } from '@rsksmart/rif-ui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { Domain } from 'models/marketItems/DomainItem';
import AddressItem from 'components/molecules/AddressItem';
import { CombinedPriceCell } from 'components/molecules';

const LISTING_TYPE = MarketListingTypes.DOMAINS;
const TX_TYPE = TxType.SELL;

const MyDomainsPage: FC<{}> = () => {
  const {
    state: {
      currentListing,
      filters: {
        domains: domainFilters,
      },
      exchangeRates: {
        currentFiat,
        crypto,
      }
    },
    dispatch,
  } = useContext(MarketStore);
  const {
    state: { account },
  } = useContext(Web3Store);
  const history = useHistory()

  const servicePath = currentListing?.servicePath;
  const statusFilter = domainFilters.status;

  /* Initialise */
  useEffect(() => {
    if (statusFilter === 'sold') {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SOLD,
        }
      })
      history.replace(ROUTES.DOMAINS.SOLD)
    }
  }, [statusFilter, dispatch, history])
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
    if (servicePath && account && servicePath === DOMAINS_SERVICE_PATHS.SELL(account) && domainFilters.status !== 'sold') // TODO: refactor
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
    owned:
    {
      name: 'Name',
      expirationDate: 'Renewal Date',
      actionCol_1: ''
    },
    placed: {
      name: 'Name',
      expirationDate: 'Renewal Date',
      price: 'Listed Price',
      actionCol_1: ''
    },
    sold: {}
  }

  const collection = currentListing?.items
    .map((domainItem: Domain) => {
      const {
        _id,
        name,
        offer,
        expirationDate,
        tokenId,
      } = domainItem;
      const pseudoResolvedName = domainFilters?.name?.$like && domainFilters?.name?.$like + '.rsk';
      const displayItem = {
        _id,
        name: name || pseudoResolvedName || <AddressItem pretext='Unknown RNS:' value={tokenId} />,
        expirationDate: expirationDate.toLocaleDateString(),
        actionCol_1: <SelectRowButton
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
        />
      }

      if (statusFilter === 'placed' && offer) {
        const { price, paymentToken } = offer;
        const currency = crypto[paymentToken];
        displayItem['price'] = <CombinedPriceCell
          price={price.toString()}
          priceFiat={(currency.rate * price).toString()}
          currency={currency.displayName}
          currencyFiat={currentFiat.displayName}
          divider=' = '
        />
      }

      return displayItem;
    })

  return (
    <MarketPageTemplate
      className="Domains"
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers[statusFilter]}
      accountRequired
    />
  );
};

export default MyDomainsPage;