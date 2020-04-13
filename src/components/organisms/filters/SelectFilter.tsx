import React from 'react';
import { Accordion } from 'rifui';
import LabeledCheckbox, { LabeledCheckboxProps } from 'rifui/components/molecules/LabeledCheckbox';

export interface SelectFilterProps {
    className?: string;
    title: string;
    items: LabeledCheckboxProps[];
}

const SelectFilter = ({ className = '', title, items }: SelectFilterProps) => {
    return <Accordion
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
}

export default SelectFilter;