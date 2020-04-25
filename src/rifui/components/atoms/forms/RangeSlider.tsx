import React, { FC, FormEvent } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Slider, { SliderProps as MUISliderProps } from '@material-ui/core/Slider';
import { colors } from '../../../theme';

interface RangeSliderProps extends MUISliderProps {
  handleChange: (event: FormEvent<Element>, newValue: number | number[]) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      color: colors.primary,
      height: 4
    },
    rail: {
      color: colors.gray3,
      height: 4,
      opacity: 1
    },
    track: {
      height: 4
    },
    thumb: {
      marginLeft: -4,
      height: 14,
      width: 14
    }
  })
);

const RangeSlider: FC<RangeSliderProps> = ({ handleChange, ...rest }) => {

  const classes = useStyles();
  const onChange = (event: any, newValue: number | number[]) => {
    handleChange(event, newValue);
  };

  return (
    <Slider
      classes={classes}
      onChange={onChange}
      {...rest}
    />
  );
};

export default RangeSlider;
