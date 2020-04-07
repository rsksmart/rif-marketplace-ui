import { MarketListingTypes } from 'models/Market';
import React, { FC } from 'react';
import './MarketFilter.css';



export interface MarketFilterProps {
  className?: string;
  listingType: MarketListingTypes;
}



const MarketFilter: FC<MarketFilterProps> = ({ className = '', children }) => {

  return (
    <div className={`filter ${className}`}>

      {/* <Form
        onChange={(ev) => {
          // const { name, value } = ev.target;
          // const newValue = {};
          // newValue[`${name}`] = value;
          // const newValues = Object.assign(formik.values, newValue);
          // formik.values = newValues;
          // formik.handleSubmit(ev)

          // dispatch({
          //   type: MARKET_ACTIONS.SET_FILTER,
          //   payload: {
          //     listingType,
          //     // filterItems: MarketFilterIface[]
          //   }
          // })
        }}
      > */}
      {children}
      {/* </Form> */}
    </div>
  );
};

export default MarketFilter;







/*
              <MarketFilterItem name="Storage Type">
                <Accordion
                  id="storage_type"
                  className="Storage Type"
                  expanded={true}
                  title="Storage Type">
                  <FilterCheckboxCard items={storageTypeItems} />
                </Accordion>
              </MarketFilterItem>
              <MarketFilterItem name="Size">
                <Accordion
                  id="size"
                  className="Size"
                  expanded={true}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  title="Size"
                >
                  <RangeSliderWithInputs
                    values={{
                      start: formik.values.sizeMin,
                      end: formik.values.sizeMax
                    }}
                    max={maxSizeVal}
                    min={minSizeVal}
                    units={sizeUnit}
                    className="w-100"
                  />
                </Accordion>
              </MarketFilterItem> */