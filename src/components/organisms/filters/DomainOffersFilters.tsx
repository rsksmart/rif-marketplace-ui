import React, { useContext } from "react";
import MarketStore from "store/Market/MarketStore";
import SearchFilter from "./SearchFilter";
import { MARKET_ACTIONS } from "store/Market/marketActions";
import RangeFilter from "./RangeFilter";

const DomainOfferFilters = () => {
    const {
        state: {
            filters: {
                domainOffers: {
                    domain,
                    price: priceFilter
                },
            },
        },
        dispatch,
    } = useContext(MarketStore);
    const nameFilter = domain?.name;
    const searchValue = (nameFilter && nameFilter.$like) || '';
    const minPrice = priceFilter && priceFilter.$gte;
    const maxPrice = priceFilter && priceFilter.$lte;

    return (<>
        <SearchFilter
            value={searchValue}
            onChange={(evt) => {
                const { currentTarget } = evt;
                const value = currentTarget.value.trim();
                const domainName = value ? { $like: value } : undefined;
                dispatch({
                    type: MARKET_ACTIONS.SET_FILTER,
                    payload: {
                        filterItems: {
                            domain: {
                                name: domainName
                            },
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
            edgeValues={{
                min: 0,  // TODO: to be defined (get min value from the cache server?)
                max: 100, // TODO: to be defined (get max value from the cache server?)
            }}
            unit='RIF'
            handleChange={({ min, max }) => {
                dispatch({
                    type: MARKET_ACTIONS.SET_FILTER,
                    payload: {
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
    </>);
}

export default DomainOfferFilters;