import React, { FC } from 'react';

export enum IconsEnum {
  BLANK = 'blank',
}

export interface IconProps {
  name: IconsEnum;
}

const styles = {
  icon: {
    width: 48,
    height: 48 * 2,
  },
};

const Icon: FC<IconProps> = () => {
  return <div style={styles.icon}></div>;
};

export default Icon;
