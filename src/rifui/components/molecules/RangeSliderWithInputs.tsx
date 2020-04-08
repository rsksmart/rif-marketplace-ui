import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SliderProps as MUISliderProps } from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

import { RangeSlider } from '../atoms/index';

export interface RangeSliderWithInputsProps extends MUISliderProps {
  values: {
    start: number,
    end: number
  };
  unit?: string;
  handleChange: ({ min, max }) => void;
};

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  input: {
    width: 42,
  },
});

const RangeSliderWithInputs: FC<RangeSliderWithInputsProps> = ({ values, unit, handleChange, ...rest }) => {
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

  return (
    <div className={classes.root}>
      <RangeSlider value={sliderRangeValues} {...rest} handleChange={handleSliderChange} />

      <Input
        className={classes.input}
        value={startValue}
        margin="dense"
        onChange={handleStartInputChange}
        onBlur={handleStartValueBlur}
        inputProps={{
          step: step,
          min: minValue,
          max: maxValue,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
      />
      {unit ? unit : ''}
      <b> to </b>
      <Input
        className={classes.input}
        value={endValue}
        margin="dense"
        onChange={handleEndInputChange}
        onBlur={handleEndValueBlur}
        inputProps={{
          step: step,
          min: minValue,
          max: maxValue,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
      />
      {unit ? unit : ''}
    </div>
  );
}

export default RangeSliderWithInputs;