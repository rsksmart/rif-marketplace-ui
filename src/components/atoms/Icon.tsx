import React, { FC } from 'react';
import rifDir from 'rifui/assets/rifDir.png';
import rifCom from 'rifui/assets/rifCom.png';
import rifGat from 'rifui/assets/rifGat.png';
import rifMar from 'rifui/assets/rifMar.png';
import rifPay from 'rifui/assets/rifPay.png';
import rifSto from 'rifui/assets/rifSto.png';

export const Icons = {
  DOMAINS: rifDir,
  COMMUNICATIONS: rifCom,
  GATEWAY: rifGat,
  MARKETPLACE: rifMar,
  PAYMENTS: rifPay,
  STORAGE: rifSto,
};

export interface IconProps {
  name: string;
}

const Icon: FC<IconProps> = ({ name }) => {
  return (
    <img
      style={{
        width: 100,
        height: 75,
      }}
      src={name}
      alt={`icon-${name}`}
    />
  );
};

export default Icon;
