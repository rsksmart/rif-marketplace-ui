import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SliderProps as MUISliderProps } from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

import { RangeSlider } from '../atoms/index';

export interface IRangeSliderWithInputsProps extends MUISliderProps {
  values: {
    start: number,
    end: number
  };
  units?: string;
};

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  input: {
    width: 42,
  },
});

interface ISliderData {
  endValue: number;
  sliderRange: number | number[];
  startValue: number;
}

const RangeSliderWithInputs: FC<IRangeSliderWithInputsProps> = ({ values, units, ...rest }) => {
  const classes = useStyles();

  const maxValue = rest.max || values.end;
  const minValue = rest.min || values.start;
  const step = rest.step || 1;

  const [state, setState] = useState<ISliderData>({
    endValue: values.end,
    startValue: values.start,
    sliderRange: [values.start, values.end]
  });

  const handleStartInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? values.start : Number(event.target.value);
    if (newValue <= state.endValue) {
      setState({
        ...state,
        sliderRange: [newValue, state.sliderRange[1]],
        startValue: newValue,
      })
    }
  };

  const handleEndInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? values.end : Number(event.target.value);
    if (newValue >= state.startValue) {
      setState({
        ...state,
        endValue: newValue,
        sliderRange: [state.sliderRange[0], newValue]
      });
    }
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setState({
      ...state,
      endValue: newValue[1],
      sliderRange: newValue,
      startValue: newValue[0]
    });
  }

  const handleStartValueBlur = () => {
    if (state.startValue < minValue) {
      setState({
        ...state,
        startValue: minValue
      });
    } else if (state.startValue > state.endValue) {
      setState({
        ...state,
        startValue: state.endValue
      });
    }
  };

  const handleEndValueBlur = () => {
    if (state.endValue < state.startValue) {
      setState({
        ...state,
        endValue: state.startValue
      });
    } else if (state.endValue > maxValue) {
      setState({
        ...state,
        endValue: maxValue
      });
    }
  };

  return (
    <div className={classes.root}>
      <RangeSlider value={state.sliderRange} {...rest} handleChange={handleSliderChange} />

      <Input
        className={classes.input}
        value={state.startValue}
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
      {units ? units : ''}
      <b> to </b>
      <Input
        className={classes.input}
        value={state.endValue}
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
      {units ? units : ''}
    </div>
  );
}

export default RangeSliderWithInputs;