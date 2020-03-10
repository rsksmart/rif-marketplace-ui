import React, { FC } from 'react';
import { Formik } from 'formik';

import './MarketFilter.css';
import MarketFilterItem from 'components/molecules/MarketFilterItem';
import Accordion from 'components/molecules/Accordion';
import { Form } from 'components/atoms/forms';
import FilterSliderCard from 'components/molecules/FilterSliderCard';
import FilterCheckboxCard from 'components/molecules/FilterCheckboxCard';
import { CheckboxProps } from 'components/atoms/forms/Checkbox';

export interface MarketFilterProps {
  className?: string;
}

const MarketFilter: FC<MarketFilterProps> = ({ className = '' }) => {
  /* Temporary constants to be replaced by store */
  const priceUnit = 'USD';
  const priceMin = '0';
  const priceMax = '100';
  const minPriceVal = -10;
  const maxPriceVal = 110;
  const sizeUnit = 'GB';
  const sizeMin = '0';
  const sizeMax = '100';
  const minSizeVal = -10;
  const maxSizeVal = 110;
  const curRif: CheckboxProps = {
    label: 'RIF',
    id: 'check-rif',
    checked: true,
  };
  /* End of temp constants */

  return (
    <div className={`filter ${className}`}>
      <Formik
        initialValues={{
          priceMin: priceMin.toString(),
          priceMax: priceMax.toString(),
          sizeMin: sizeMin.toString(),
          sizeMax: sizeMax.toString(),
          curRif: curRif.checked,
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {formik => {
          const currencyItems: CheckboxProps[] = [];

          curRif.onChange = formik.handleChange;
          curRif.value = formik.values.curRif;
          currencyItems.push(curRif);
          return (
            <Form>
              <MarketFilterItem name="Price">
                <Accordion
                  className="Price"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <FilterSliderCard
                    values={{
                      start: formik.values.priceMin,
                      end: formik.values.priceMax,
                    }}
                    minVal={minPriceVal}
                    maxVal={maxPriceVal}
                    handleChange={formik.handleChange}
                    unit={priceUnit}
                  />
                </Accordion>
              </MarketFilterItem>
              <MarketFilterItem name="Currency">
                <Accordion className="Curreny">
                  <FilterCheckboxCard items={currencyItems} />
                </Accordion>
              </MarketFilterItem>
              <MarketFilterItem name="Size">
                <Accordion
                  className="Size"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <FilterSliderCard
                    values={{
                      start: formik.values.sizeMin,
                      end: formik.values.sizeMax,
                    }}
                    minVal={minSizeVal}
                    maxVal={maxSizeVal}
                    handleChange={formik.handleChange}
                    unit={sizeUnit}
                  />
                </Accordion>
              </MarketFilterItem>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MarketFilter;
