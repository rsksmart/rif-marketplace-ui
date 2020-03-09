import React, { FC } from 'react';

export enum IconsEnum {
  BLANK = 'blank',
}

export interface IconProps {
  name: IconsEnum;
}

const Icon: FC<IconProps> = () => {
  return <div></div>;
};

export default Icon;
