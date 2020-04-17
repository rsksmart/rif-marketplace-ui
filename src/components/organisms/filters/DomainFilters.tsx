import React, { useContext } from "react";
import MarketStore from "store/Market/MarketStore";
import SearchFilter from "./SearchFilter";
import { MARKET_ACTIONS } from "store/Market/marketActions";

const DomainFilters = () => {
    const {
        state: {
            filters: {
                domains: {
                    name: nameFilter,
                },
            },
        },
        dispatch,
    } = useContext(MarketStore);

    const searchValue = (nameFilter && nameFilter.$like) || '';

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
    </>);
}

export default DomainFilters;