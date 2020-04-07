import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect, FC, useState } from 'react';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { useMarketUtils } from 'store/Market/marketStoreUtils';
import SearchFilter from 'components/organisms/filters/SearchFilter';
import RangeFilter from 'components/organisms/filters/RangeFilter';

const DomainsPage = () => {
  const {
    state: {
      MarketState: {
        listings: { domainListing },
        filters,
        metadata: {
          domainListing: { lastUpdated },
        },
      },
      AppState: { isLoading },
    },
    dispatch,
  } = useContext(MarketStore);
  const { fetchListingItems } = useMarketUtils(dispatch);
  const history = useHistory()
  const domainsFilter = filters.domainListing;

  useEffect(() => {
    if (lastUpdated < 0 && !isLoading) {
      (async () => {
        const items = await fetchListingItems(
          MarketListingTypes.domainListing,
          domainsFilter
        );

        dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingTypes.domainListing,
            items,
          },
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated, isLoading, domainsFilter]);

  useEffect(() => {
    (async () => {
      const items = await fetchListingItems(
        MarketListingTypes.domainListing,
        domainsFilter
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
  }, [domainsFilter]);

  // TODO: extract (possibly into action)
  const headers = {
    sellerDomain: 'Name',
    sellerAddress: 'Seller',
    expirationDatetime: 'Renewal Date',
    combinedPrice: 'Price',
    actionCol_1: ''
  }

  const collection = domainListing.map(domainItem => {
    const { _id, seller, price, price_fiat, currency, expirationDate } = domainItem;

    const priceCellProps = { price, price_fiat, currency, currency_fiat: 'USD', divider: ' = ' };
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

  const [searchValue, setSearchValue] = useState('')
  // const [minPriceFilter, setMinPriceFilter] = useState(0)
  // const [maxPriceFilter, setmaxPriceFilter] = useState(0)

  const DomainsFilters: FC<{ searchValue, setSearchValue }> = (props) => {
    return (
      <>
        <SearchFilter
          value={props.searchValue}
          onChange={(evt) => {
            const { currentTarget: { value } } = evt;
            dispatch({
              type: MARKET_ACTIONS.SET_FILTER,
              payload: {
                listingType: MarketListingTypes.domainListing,
                filterItems: {
                  sellerDomain: {
                    $like: value
                  }
                }
              }
            })
            console.log('value:', value);
            props.setSearchValue(value);
          }}
        />
        <RangeFilter
          title='Price'
          currentValues={{
            min: domainsFilter.price['$gte'],
            max: domainsFilter.price['$lte'],
          }}
          maxValues={{
            min: domainsFilter.price['$gte'],
            max: domainsFilter.price['$lte'],
          }}
          unit='RIF'
        />
      </>
    )
  }
  // End of extract block

  return (
    <MarketPageTemplate
      className="Domains"
      listingType={MarketListingTypes.domainListing}
      filterItems={<DomainsFilters searchValue={searchValue} setSearchValue={setSearchValue} />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainsPage;