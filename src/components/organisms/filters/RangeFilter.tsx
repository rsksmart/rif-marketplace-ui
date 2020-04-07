import React, { FC } from 'react'
import MarketFilterItem from 'components/molecules/MarketFilterItem';
import { Accordion, RangeSliderWithInputs } from 'rifui';

export interface RangeFilterProps {
    className?: string
    title: string
    currentValues: {
        min: number,
        max: number
    },
    maxValues: {
        min: number,
        max: number
    },
    unit: string
}

const RangeFilter: FC<RangeFilterProps> = ({ className = '', title, currentValues, maxValues, unit }) => {

    return <MarketFilterItem name={title}>
        <Accordion
            id={title.toLocaleLowerCase()}
            className={`${title} ${className}`}
            expanded={true}
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
            title={title}
        >
            <RangeSliderWithInputs
                values={{
                    start: currentValues.min,
                    end: currentValues.max,
                }}
                min={maxValues.min}
                max={maxValues.max}
                units={unit}
                className={`w-100 ${className}`}
            />
        </Accordion>
    </MarketFilterItem>
}

export default RangeFilter;