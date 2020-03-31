import React, { FC } from 'react';

import {
  Typography as MUITypography,
  TypographyProps as MUITypographyProps
} from '@material-ui/core';

export interface TypographyProps extends MUITypographyProps { };

const Typography: FC<TypographyProps> = ({ children, ...rest }) => {
  return (
    <MUITypography {...rest}>
      {children}
    </MUITypography>
  );
};

export default Typography;