import React, { FC, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { SliderProps as MUISliderProps } from '@material-ui/core/Slider';
import { RangeSlider, Typography, UnitsInput } from 'rifui';

export interface RangeSliderWithInputsProps extends MUISliderProps {
  values: {
    start: number,
    end: number
  };
  units?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  ({
    root: {
      width: "100%",
    },
    inputsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
  })
);

// .ito TODO: use masks to display units better - ask Diego if it will be editable
// https://material-ui.com/components/text-fields/#integration-with-3rd-party-input-libraries

const RangeSliderWithInputs: FC<RangeSliderWithInputsProps> = ({ values, units, ...rest }) => {
  const classes = useStyles();

  const maxValue = rest.max || values.end;
  const minValue = rest.min || values.start;
  const step = rest.step || 1;

  const [startValue, setStartValue] = useState<number>(values.start);
  const [endValue, setEndValue] = useState<number>(values.end);
  const [sliderRangeValues, setSliderRangeValues] = useState<number | number[]>([startValue, endValue]);

  const handleStartInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartValue = event.target.value === '' ? values.start : Number(event.target.value);
    if (newStartValue <= endValue) {
      setStartValue(newStartValue);
      setSliderRangeValues([newStartValue, sliderRangeValues[1]]);
    }
  };

  const handleEndInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndValue = event.target.value === '' ? values.end : Number(event.target.value);
    if (newEndValue >= startValue) {
      setSliderRangeValues([sliderRangeValues[0], newEndValue]);
      setEndValue(newEndValue);
    }
  };

  const handleSliderChange = (event: any, newSliderValue: number | number[]) => {
    setEndValue(newSliderValue[1]);
    setStartValue(newSliderValue[0]);
    setSliderRangeValues(newSliderValue);
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
      units: units,
    }
  }

  return (
    <div className={classes.root}>
      <RangeSlider value={sliderRangeValues} {...rest} handleChange={handleSliderChange} />
      <div className={classes.inputsContainer}>
        <UnitsInput
          handleOnBlur={handleStartValueBlur}
          handleOnChange={handleStartInputChange}
          {...getCommonInputValues()}
          value={startValue}
        />
        <Typography weight='bold'>
          to
        </Typography>
        <UnitsInput
          handleOnBlur={handleEndValueBlur}
          handleOnChange={handleEndInputChange}
          {...getCommonInputValues()}
          value={endValue}
        >
        </UnitsInput>
      </div>
    </div>
  );
}

export default RangeSliderWithInputs;