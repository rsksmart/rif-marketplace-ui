import { Web3Store } from '@rsksmart/rif-ui';
import { createSoldService, DOMAINS_SERVICE_PATHS, fetchSoldDomains } from 'api/rif-marketplace-cache/domainsController';
import { CombinedPriceCell } from 'components/molecules';
import AddressItem from 'components/molecules/AddressItem';
import DomainFilters from 'components/organisms/filters/DomainFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import { SoldDomain } from 'models/marketItems/DomainItem';
import React, { FC, useContext, useEffect } from 'react';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';

const LISTING_TYPE = MarketListingTypes.DOMAINS;
const TX_TYPE = TxType.SOLD;

const SoldDomainsPage: FC<{}> = () => {
  const {
    state: {
      currentListing,
      exchangeRates: {
        currentFiat,
        crypto,
      },
      filters: {
        domains: domainFilters,
      }
    },
    dispatch,
  } = useContext(MarketStore);
  const {
    state: { account },
  } = useContext(Web3Store);
  const history = useHistory()

  const servicePath = currentListing?.servicePath;
  const {
    status: statusFilter
  } = domainFilters;
  /* Initialise */
  useEffect(() => {
    if (statusFilter !== 'sold') {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SELL,
        }
      })
      history.replace(ROUTES.DOMAINS.SELL)
    }
  }, [statusFilter, dispatch, history])

  useEffect(() => {
    if (servicePath && account && servicePath !== DOMAINS_SERVICE_PATHS.SOLD(account)) {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SOLD
        }
      })
    }
  }, [servicePath, account, dispatch])
  useEffect(() => {
    if (!servicePath && account) {
      const serviceAddr = createSoldService(account);
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
    if (servicePath && account && servicePath === DOMAINS_SERVICE_PATHS.SOLD(account) && domainFilters.status === 'sold') // TODO: refactor
      fetchSoldDomains(domainFilters)
        .then(items => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: LISTING_TYPE,
            items,
          },
        }));
  }, [account, servicePath, dispatch, domainFilters]);

  if (!currentListing) return null;

  const headers = {
    domainName: 'Name',
    buyer: 'Buyer',
    currency: 'Currency',
    sellingPrice: 'Selling price',
    soldDate: 'Selling date',
  }

  const collection = currentListing?.items
    .map((domainItem: SoldDomain) => {
      const {
        _id,
        domainName,
        buyer,
        paymentToken,
        price,
        soldDate,
        tokenId,
      } = domainItem;
      const currency = crypto[paymentToken];

      const pseudoResolvedName = domainFilters?.name?.$like && domainFilters?.name?.$like + '.rsk';
      const displayItem = {
        _id,
        domainName: domainName || pseudoResolvedName || <AddressItem pretext='Unknown RNS:' value={tokenId} />,
        buyer: <AddressItem value={buyer} />,
        currency: currency.displayName,
        sellingPrice: <CombinedPriceCell
          price={price.toString()}
          priceFiat={(currency.rate * price).toString()}
          currency={currency.displayName}
          currencyFiat={currentFiat.displayName}
          divider=' = '
        />,
        soldDate: soldDate.toLocaleDateString(),
      }

      return displayItem;
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

export default SoldDomainsPage;