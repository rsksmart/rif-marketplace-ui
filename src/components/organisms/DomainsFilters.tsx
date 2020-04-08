import { DomainsFilterIface } from 'api/models/RnsFilter';
import { MarketListingTypes } from 'models/Market';
import React, { useContext } from 'react';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import RangeFilter from './filters/RangeFilter';
import SearchFilter from './filters/SearchFilter';


const DomainsFilters = () => {
    const {
        state: {
            MarketState: {
                filters: {
                    domainListing: {
                        sellerDomain: {
                            $like: searchValue,
                        },
                        price: {
                            $gte: minPrice,
                            $lte: maxPrice,
                        }
                    }
                }
            }
        },
        dispatch
    } = useContext(MarketStore);

    return (
        <>
            <SearchFilter
                value={searchValue}
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
                }}
            />
            <RangeFilter
                title='Price'
                values={{
                    start: minPrice,
                    end: maxPrice,
                }}
                hedgeValues={{
                    min: 0,  // TODO: to be defined (get min value from the cache server?)
                    max: 100, // TODO: to be defined (get max value from the cache server?)
                }}
                unit='RIF'
                handleChange={({ min, max }) => {
                    dispatch({
                        type: MARKET_ACTIONS.SET_FILTER,
                        payload: {
                            listingType: MarketListingTypes.domainListing,
                            filterItems: {
                                price: {
                                    $gte: min,
                                    $lte: max,
                                }
                            }
                        }
                    })
                }}
            />
        </>
    )
}

export default DomainsFilters;