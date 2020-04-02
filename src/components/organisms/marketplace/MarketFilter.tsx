import React, { FC } from 'react';
import { Formik } from 'formik';

import './MarketFilter.css';
import MarketFilterItem from 'components/molecules/MarketFilterItem';

import { LabeledCheckboxProps } from 'rifui/components/molecules/LabeledCheckbox';
import {
  Accordion,
  FilterCheckboxCard,
  Grid,
  RangeSliderWithInputs,
  SwitchTabs,
  Typography,
} from 'rifui';
import SearchFilter from 'components/molecules/SearchFilter';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface MarketFilterProps {
  className?: string;
  filters: {}[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  form: {
    padding: theme.spacing(3)
  },
  formHeading: {
    paddingBottom: theme.spacing(2)
  }
}));
const MarketFilter: FC<MarketFilterProps> = ({ className = '' }) => {
  const classes = useStyles();

  /* Temporary constants to be replaced by store */
  const priceUnit = 'USD';
  const priceMin = 0;
  const priceMax = 100;
  const minPriceVal = -10;
  const maxPriceVal = 110;
  const sizeUnit = 'GB';
  const sizeMin = 0;
  const sizeMax = 100;
  const minSizeVal = -10;
  const maxSizeVal = 110;

  const curRif: LabeledCheckboxProps = {
    checked: true,
    id: 'check-rif',
    labelText: 'RIF',
    labelClassName: '',
  };
  const curRbtc: LabeledCheckboxProps = {
    checked: true,
    id: 'check-rbtc',
    labelText: 'R-BTC',
    labelClassName: '',
  };
  const curDoc: LabeledCheckboxProps = {
    checked: true,
    id: 'check-doc',
    labelText: 'DOC (Dollar on Chain)',
    labelClassName: '',
  };

  const curSwarm: LabeledCheckboxProps = {
    checked: true,
    id: 'check-rif',
    labelText: 'RIF',
    labelClassName: '',
  };
  const curIpfs: LabeledCheckboxProps = {
    checked: true,
    id: 'check-rbtc',
    labelText: 'R-BTC',
    labelClassName: '',
  };
  const curSia: LabeledCheckboxProps = {
    checked: true,
    id: 'check-doc',
    labelText: 'DOC (Dollar on Chain)',
    labelClassName: '',
  };
  /* End of temp constants */

  const handleSwitchChange = (newSwitchValue: number) => console.log(`New switch value: ${newSwitchValue}`);

  return (
    <div className={`filter ${className}`}>
      <Formik
        initialValues={{
          priceMin: priceMin,
          priceMax: priceMax,
          sizeMin: sizeMin,
          sizeMax: sizeMax,
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
            <form className={classes.form} >
              <Grid className={classes.formHeading} container>
                <Grid item md={6}>
                  <Typography weight='bold' variant='h5'>
                    Domains
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <SwitchTabs label1='Buy' label2='Sell' onChange={handleSwitchChange} />
                </Grid>
              </Grid>
              <SearchFilter onChange={formik.handleChange}></SearchFilter>
              <MarketFilterItem name="Price">
                <Accordion
                  id="price"
                  className="Price"
                  expanded={true}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  title="Price"
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
                  />
                </Accordion>
              </MarketFilterItem>
              <MarketFilterItem name="Currency">
                <Accordion
                  id="currency"
                  className="Currency"
                  expanded={true}
                  title="Currency">
                  <FilterCheckboxCard items={currencyItems} />
                </Accordion>
              </MarketFilterItem>
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
              </MarketFilterItem>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MarketFilter;
