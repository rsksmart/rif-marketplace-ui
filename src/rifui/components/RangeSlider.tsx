import React, { FC, FormEvent} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider, { SliderProps as MUISliderProps } from '@material-ui/core/Slider';

interface RangeSliderProps extends MUISliderProps {
  handleChange: (event: FormEvent<Element>, newValue: number | number[]) => void;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const RangeSlider: FC<RangeSliderProps> = ({ handleChange, ...rest }) => {

  const classes = useStyles();
  const onChange = (event: any, newValue: number | number[]) => {
    handleChange(event, newValue);
  };

  return (
    <div className={classes.root}>
      <Slider
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};

export default RangeSlider;
