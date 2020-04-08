import { Form } from 'components/atoms/forms';
import { MarketListingTypes } from 'models/Market';
import React, { FC, useContext } from 'react';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import './MarketFilter.css';



export interface MarketFilterProps {
  className?: string;
  listingType: MarketListingTypes;
}



const MarketFilter: FC<MarketFilterProps> = ({ className = '', listingType, children }) => {
  const {
    dispatch,
  } = useContext(MarketStore);

  return (
    <div className={`filter ${className}`}>
      {children}
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