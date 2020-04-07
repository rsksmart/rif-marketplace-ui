import React, { FC } from 'react'
import MarketFilterItem from 'components/molecules/MarketFilterItem';
import { Accordion } from 'rifui';
import LabeledCheckbox, { LabeledCheckboxProps } from 'rifui/components/molecules/LabeledCheckbox';
import { useField, FieldInputProps } from 'formik';

export interface SelectFilterProps {
    className?: string;
    title: string;
    items: LabeledCheckboxProps[];
}

const SelectFilter = ({ className = '', title, items }: SelectFilterProps) => {
    return <MarketFilterItem name={title.toLocaleLowerCase()}>
        <Accordion
            id={title.toLocaleLowerCase()}
            className={`${title} ${className}`}
            expanded={true}
            title={title}>
            {items.map((item: LabeledCheckboxProps, i) => (
                <LabeledCheckbox
                    key={`lc-${item.id}` || `lc-${i}-${className.trim()}`}
                    labelClassName={item.labelClassName}
                    {...item}
                />
            ))}
        </Accordion>
    </MarketFilterItem>
}

export default SelectFilter;