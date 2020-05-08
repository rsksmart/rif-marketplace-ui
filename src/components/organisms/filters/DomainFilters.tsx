import React, { useContext, ChangeEvent, useState, useEffect } from "react";
import { MARKET_ACTIONS } from "store/Market/marketActions";
import MarketStore, { TxType } from "store/Market/MarketStore";
import RadioFilter from "./RadioFilter";
import SearchFilter from "./SearchFilter";
import { ROUTES } from "routes";
import { useHistory } from "react-router";

const DomainFilters = () => {
    const {
        state: {
            currentListing: {
                txType
            },
            filters: {
                domains: {
                    name: nameFilter,
                    status: statusFilter,
                }
            },
        },
        dispatch,
    } = useContext(MarketStore);
    const history = useHistory();
    const searchValue = (nameFilter && nameFilter.$like) || '';
    const [isSold, setIsSold] = useState(txType === TxType.SOLD)

    useEffect(() => {
        setIsSold(txType === TxType.SOLD)
    }, [txType])

    const domainStatusFilters = [{
        value: 'owned',
        label: 'Your domains'
    },
    {
        value: 'placed',
        label: 'Your offers'
    },
    {
        value: 'sold',
        label: 'Sold domains'
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
            onChange={(_, value: string) => {
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