import React, { FC, useContext, useEffect } from 'react'
import MarketStore from 'store/Market/MarketStore';
import { useMarketUtils } from 'store/Market/marketStoreUtils';
import { MarketListingTypes } from 'models/Market';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import SearchFilter from './filters/SearchFilter';
import RangeFilter from './filters/RangeFilter';

export interface DomainsFiltersProps {
    className?: string
    searchValue: string
    setSearchValue: any
}

const DomainsFilters: FC<DomainsFiltersProps> = ({ className = '', searchValue, setSearchValue }) => {
    const {
        state: {
            AppState: {
                isLoading
            },
            MarketState: {
                filters: {
                    domainsFilter
                }
            }
        },
        dispatch
    } = useContext(MarketStore);
    const { fetchListingItems } = useMarketUtils(dispatch);

    // useEffect(() => {
    //     if (!isLoading) {
    //         (async () => {
    //             const items = await fetchListingItems(
    //                 MarketListingTypes.domainListing,
    //                 domainsFilter
    //             );

    //             dispatch({
    //                 type: MARKET_ACTIONS.SET_ITEMS,
    //                 payload: {
    //                     listingType: MarketListingTypes.domainListing,
    //                     items,
    //                 },
    //             });
    //         })();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchValue, domainsFilter])

    return (
        <>
            <SearchFilter
                value={searchValue}
                onChange={(evt) => {
                    const { currentTarget: { value } } = evt;
                    console.log('value:', value);
                    setSearchValue(value);
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

export default DomainsFilters;