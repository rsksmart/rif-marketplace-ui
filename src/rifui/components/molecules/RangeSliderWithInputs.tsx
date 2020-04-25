import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SliderProps as MUISliderProps } from '@material-ui/core/Slider';
import { RangeSlider, Typography  } from '../atoms';
import UnitsInput from './UnitsInput';

export interface RangeSliderWithInputsProps extends MUISliderProps {
  values: {
    start: number,
    end: number
  };
  unit?: string;
  handleChange: ({ min, max }) => void;
  className?: string;
};

const useStyles = makeStyles(() =>
  ({
    root: {
      width: "100%",
    },
    inputsContainer: {
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    toContainer: {
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }
  })
);

const RangeSliderWithInputs: FC<RangeSliderWithInputsProps> = ({ values, unit, handleChange, className, ...rest }) => {
  const classes = useStyles();

  const maxValue = rest.max || values.end;
  const minValue = rest.min || values.start;
  const step = rest.step || 1;

  const [startValue, setStartValue] = useState<number>(values.start);
  const [endValue, setEndValue] = useState<number>(values.end);
  const [sliderRangeValues, setSliderRangeValues] = useState<number[]>([startValue, endValue]);

  const handleStartInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartValue = event.target.value === '' ? values.start : Number(event.target.value);
    if (newStartValue <= endValue) {
      setStartValue(newStartValue);
      setSliderRangeValues([newStartValue, sliderRangeValues[1]]);
    }
    handleChange({ min: startValue, max: endValue })
  };

  const handleEndInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndValue = event.target.value === '' ? values.end : Number(event.target.value);
    if (newEndValue >= startValue) {
      setSliderRangeValues([sliderRangeValues[0], newEndValue]);
      setEndValue(newEndValue);
    }
    handleChange({ min: startValue, max: endValue })
  };

  const handleSliderChange = (event: any, newSliderValue: number | number[]) => {
    setEndValue(newSliderValue[1]);
    setStartValue(newSliderValue[0]);
    setSliderRangeValues(newSliderValue as number[]);
    handleChange({ min: startValue, max: endValue })
  }

  const handleStartValueBlur = () => {
    if (startValue < minValue) {
      setStartValue(minValue);
    } else if (startValue > endValue) {
      setStartValue(endValue);
    }
  };

  const handleEndValueBlur = () => {
    if (endValue < startValue) {
      setEndValue(startValue);
    } else if (endValue > maxValue) {
      setEndValue(maxValue);
    }
  };

  const getCommonInputValues = () => {
    return {
      maxValue: maxValue,
      minValue: minValue,
      step: step,
      units: unit,
    }
  }

  return (
    <div className={`${classes.root} ${className}`.trim()}>
      <RangeSlider value={sliderRangeValues} {...rest} handleChange={handleSliderChange} />
      <div className={classes.inputsContainer}>
        <UnitsInput
          handleOnBlur={handleStartValueBlur}
          handleOnChange={handleStartInputChange}
          {...getCommonInputValues()}
          value={startValue}
        />
        <Typography className={classes.toContainer} weight='bold'>
          to
        </Typography>
        <UnitsInput
          handleOnBlur={handleEndValueBlur}
          handleOnChange={handleEndInputChange}
          {...getCommonInputValues()}
          value={endValue}
        />
      </div>
    </div>
  );
}

export default RangeSliderWithInputs;