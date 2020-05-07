import React, { useContext, useState } from "react";
import { MARKET_ACTIONS } from "store/Market/marketActions";
import MarketStore from "store/Market/MarketStore";
import RadioFilter from "./RadioFilter";
import SearchFilter from "./SearchFilter";

const DomainFilters = () => {
    const {
        state: {
            filters: {
                domains: {
                    name: nameFilter,
                    status: statusFilter,
                }
            },
        },
        dispatch,
    } = useContext(MarketStore);
    const searchValue = (nameFilter && nameFilter.$like) || '';

    const domainStatusFilters = [{
        value: 'owned',
        label: 'Your domains',
    },
    {
        value: 'placed',
        label: 'Your offers',
    },
    {
        value: 'sold',
        label: 'Sold domains',
    }];
    return (<>
        <SearchFilter
            value={searchValue}
            onChange={(evt) => {
                const { currentTarget } = evt;
                const value = currentTarget.value.trim();
                const name = value ? { $like: value } : undefined;
                dispatch({
                    type: MARKET_ACTIONS.SET_FILTER,
                    payload: {
                        filterItems: {
                            name,
                        }
                    }
                })
            }}
        />
        <RadioFilter
            title='Domain Status'
            items={domainStatusFilters}
            value={statusFilter}
            onChange={({ target: { value } }) => {
                dispatch({
                    type: MARKET_ACTIONS.SET_FILTER,
                    payload: {
                        filterItems: {
                            status: value
                        }
                    }
                })
            }}
        />
    </>);
}

export default DomainFilters;