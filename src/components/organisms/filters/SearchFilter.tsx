import MarketFilterItem from 'components/molecules/MarketFilterItem';
import React, { FC } from 'react';
import { TextField } from 'rifui';

export interface SearchFilterProps extends React.HTMLAttributes<HTMLElement> {
    className?: string,
    label?: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const SearchFilter: FC<SearchFilterProps> = ({ label = 'Search', className = '', value, onChange }) => {
    // const { state, dispatch } = useContext(MarketStore);
    // const [textValue, setTextValue] = useState('')

    // useEffect(() => {
    //     textValue && dispatch({
    //         type: MARKET_ACTIONS.SET_FILTER,
    //         payload: {
    //             listingType: MarketListingTypes.domainListing,
    //             filterItems: {
    //                 domain: {
    //                     $like: textValue
    //                 }
    //             }
    //         }
    //     })
    // }, [textValue])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        // const { currentTarget: { value } } = event;

        // // dispatch({
        // //     type: MARKET_ACTIONS.SET_FILTER,
        // //     payload: {
        // //         listingType: MarketListingTypes.domainListing,
        // //         filterItems: {
        // //             domain: {
        // //                 $like: value
        // //             }
        // //         }
        // //     }
        // // })

        // console.log('\n\n\nvalue:', value);
        // setTextValue(value);

        !!onChange && onChange(event);
    }



    return <MarketFilterItem name={label}>
        <TextField onChange={onChange} value={value} name="search" label={label} className={`w-100 ${className}`} />
    </MarketFilterItem>
}

export default SearchFilter