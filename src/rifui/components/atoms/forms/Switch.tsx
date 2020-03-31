import React, { FC, useState } from 'react';
import { Switch as MUISwitch, SwitchProps as MUISwitchProps, Typography } from '@material-ui/core';

export interface SwitchProps extends MUISwitchProps {
  checkedText?: string;
  uncheckedText?: string;
};

const Switch: FC<SwitchProps> = ({ checkedText, uncheckedText, ...rest }) => {
  return (
    <>
      {/* TODO: put the checked and unchecked text inside the switch */}
      <MUISwitch {...rest} />
    </>
  );
};

export default Switch;