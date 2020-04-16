import React, { FC } from 'react';
import { Switch as MUISwitch, SwitchProps as MUISwitchProps } from '@material-ui/core';

export interface SwitchProps extends MUISwitchProps {
};

const Switch: FC<SwitchProps> = ({ ...rest }) => {
  return (
    <MUISwitch {...rest} />
  );
};

export default Switch;