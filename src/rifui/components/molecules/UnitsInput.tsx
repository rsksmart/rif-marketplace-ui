import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { InputProps } from '../atoms/forms/Input';
import { Input, InputAdornment, Typography } from 'rifui';
import { colors } from 'rifui/theme';

export interface UnitsInputProps extends InputProps {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnBlur: () => void;
  maxValue?: number;
  minValue?: number;
  step?: number;
  units?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: colors.gray2,
    color: colors.gray4,
    display: 'flex',
  },
  input: {
    color: colors.gray4,
    textAlign: 'center',
    '&::before': {
      borderBottom: `1px solid ${colors.gray4}`
    },
  },
  adornmentTypography: {
    color: colors.gray4
  }
}));

const UnitsInput: FC<UnitsInputProps> = props => {
  const {
    handleOnBlur,
    handleOnChange,
    maxValue,
    minValue,
    units,
    value,
    step = 1
  } = props;

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Input
        className={classes.input}
        classes={{ input: classes.input }}
        value={value}
        margin="dense"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        inputProps={{
          step: step,
          min: minValue,
          max: maxValue,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        endAdornment={
          <InputAdornment position="end">
            <Typography
              className={classes.adornmentTypography}>
              {units ? units : ''}
            </Typography>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default UnitsInput;
