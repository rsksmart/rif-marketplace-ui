import React, { useContext, useState, useEffect } from "react";
import MarketStore from "store/Market/MarketStore";
import SearchFilter from "./SearchFilter";
import { MARKET_ACTIONS } from "store/Market/marketActions";
import RangeFilter from "./RangeFilter";
import { fetchMinMaxPrice } from "api/rif-marketplace-cache/domainsController";

const DomainOfferFilters = () => {
    const {
        state: {
            currentListing,
            filters: {
                domainOffers: {
                    domain,
                    price: {
                        $gte: curMinPrice,
                        $lte: curMaxPrice,
                    }
                },
            },
        },
        dispatch,
    } = useContext(MarketStore);
    const nameFilter = domain?.name;
    const servicePath = currentListing?.servicePath;
    const searchValue = (nameFilter && nameFilter.$like) || '';
    const [absMinPrice, setAbsMinPrice] = useState(curMinPrice);
    const [absMaxPrice, setAbsMaxPrice] = useState(curMaxPrice);

    useEffect(() => {
        if (servicePath) {
            fetchMinMaxPrice()
                .then(({ minPrice, maxPrice }) => {
                    dispatch({
                        type: MARKET_ACTIONS.SET_FILTER,
                        payload: {
                            filterItems: {
                                price: {
                                    $gte: minPrice,
                                    $lte: maxPrice
                                }
                            }
                        }
                    });
                    setAbsMinPrice(minPrice);
                    setAbsMaxPrice(maxPrice);
                })
        }
    }, [servicePath, dispatch])

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
                start: curMinPrice,
                end: curMaxPrice,
            }}
            edgeValues={{
                min: absMinPrice,
                max: absMaxPrice,
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