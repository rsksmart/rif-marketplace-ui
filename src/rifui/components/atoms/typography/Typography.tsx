import React, { FC } from 'react';
import {
  Typography as MUITypography,
  TypographyProps as MUITypographyProps
} from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { fonts } from '../../../theme';

export interface TypographyProps extends MUITypographyProps {
  weight?: 'normal' | 'lightBold' | 'bold' | 'superBold'
};

const useStyles = makeStyles((theme: Theme) => ({
  normal: {
    fontWeight: fonts.weight.normal
  },
  lightBold: {
    fontWeight: fonts.weight.lightBold
  },
  bold: {
    fontWeight: fonts.weight.bold
  },
  superBold: {
    fontWeight: fonts.weight.superBold
  }
}));

const Typography: FC<TypographyProps> = ({ weight = 'normal', className = '', children, ...rest }) => {
  const classes = useStyles();

  return (
    <MUITypography className={`${classes[weight]} ${className}`.trim()} {...rest}>
      {children}
    </MUITypography>
  );
};

export default Typography;