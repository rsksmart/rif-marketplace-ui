import React, { FC } from 'react';
import { Formik } from 'formik';

import './MarketFilter.css';
import MarketFilterItem from 'components/molecules/MarketFilterItem';
import Accordion from 'components/molecules/Accordion';
import { Form, FormControl } from 'components/atoms/forms';
import FilterSliderCard from 'components/molecules/FilterSliderCard';
import FilterCheckboxCard from 'components/molecules/FilterCheckboxCard';
import { CheckboxProps } from 'components/atoms/forms/Checkbox';

import { RangeSlider } from 'rifui';
import RangeSliderWithInputs from 'components/molecules/RangeSliderWithInputs';

export interface MarketFilterProps {
  className?: string;
  filters: {}[];
}

const MarketFilter: FC<MarketFilterProps> = ({ className = '' }) => {
  /* Temporary constants to be replaced by store */
  const priceUnit = 'USD';
  const priceMin = 0;
  const priceMax = 100;
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
  const curRbtc: CheckboxProps = {
    label: 'R-BTC',
    id: 'check-rbtc',
    checked: true,
  };
  const curDoc: CheckboxProps = {
    label: 'DOC (Dollar on Chain)',
    id: 'check-doc',
    checked: true,
  };

  const curSwarm: CheckboxProps = {
    label: 'RIF',
    id: 'check-rif',
    checked: true,
  };
  const curIpfs: CheckboxProps = {
    label: 'R-BTC',
    id: 'check-rbtc',
    checked: true,
  };
  const curSia: CheckboxProps = {
    label: 'DOC (Dollar on Chain)',
    id: 'check-doc',
    checked: true,
  };
  /* End of temp constants */

  return (
    <div className={`filter ${className}`}>
      <Formik
        initialValues={{
          priceMin: priceMin,
          priceMax: priceMax,
          sizeMin: sizeMin.toString(),
          sizeMax: sizeMax.toString(),
          curRif: curRif.checked,
          curRbtc: curRbtc.checked,
          curDoc: curDoc.checked,
          curSwarm: curRif.checked,
          curIpfs: curRbtc.checked,
          curSia: curDoc.checked,
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {formik => {
          curRif.onChange = formik.handleChange;
          curRif.value = formik.values.curRif;
          curRbtc.onChange = formik.handleChange;
          curRbtc.value = formik.values.curRbtc;
          curDoc.onChange = formik.handleChange;
          curDoc.value = formik.values.curDoc;

          const currencyItems = [curRif, curRbtc, curDoc];

          curSwarm.onChange = formik.handleChange;
          curSwarm.value = formik.values.curSwarm;
          curIpfs.onChange = formik.handleChange;
          curIpfs.value = formik.values.curIpfs;
          curSia.onChange = formik.handleChange;
          curSia.value = formik.values.curSia;

          const storageTypeItems = [curSwarm, curIpfs, curSia];

          return (
            <Form>
              <FormControl onChange={formik.handleChange} name="search" />
              <MarketFilterItem name="Price">
                <Accordion
                  className="Price"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <RangeSliderWithInputs
                    values={{
                      start: formik.values.priceMin,
                      end: formik.values.priceMax
                    }}
                    max={maxPriceVal}
                    min={minPriceVal}
                    units={priceUnit}
                    className="w-100"
                  // handleChange={formik.handleChange}
                  />
                  <FilterSliderCard
                    values={{
                      start: formik.values.priceMin.toString(),
                      end: formik.values.priceMax.toString(),
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
              <MarketFilterItem name="Storage Type">
                <Accordion className="Storage Type">
                  <FilterCheckboxCard items={storageTypeItems} />
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
