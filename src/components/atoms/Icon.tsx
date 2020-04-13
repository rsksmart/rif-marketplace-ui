import React, { FC } from 'react';
import rifDir from 'rifui/assets/images/rifDir.png';
import rifCom from 'rifui/assets/images/rifCom.png';
import rifGat from 'rifui/assets/images/rifGat.png';
import rifMar from 'rifui/assets/images/rifMar.png';
import rifPay from 'rifui/assets/images/rifPay.png';
import rifSto from 'rifui/assets/images/rifSto.png';

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
  alt?: string;
}

const Icon: FC<IconProps> = ({ name, alt }) => {
  return (
    <img
      style={{
        width: 100,
        height: 75,
      }}
      src={name}
      alt={alt || name}
    />
  );
};

export default Icon;
