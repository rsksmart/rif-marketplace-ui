import React, { FC } from 'react';
import rifDir from 'rifui/assets/images/rifDir.png';
import rifCom from 'rifui/assets/images/rifCom.png';
import rifGat from 'rifui/assets/images/rifGat.png';
import rifMar from 'rifui/assets/images/rifMar.png';
import rifPay from 'rifui/assets/images/rifPay.png';
import rifSto from 'rifui/assets/images/rifSto.png';
import { makeStyles, Theme } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme: Theme) => ({
  img: {
    height: 75,
    width: 100,
  }
}));

const Icon: FC<IconProps> = ({ name, alt }) => {
  const classes = useStyles();
  return (
    <img
      className={classes.img}
      src={name}
      alt={alt || name}
    />
  );
};

export default Icon;
