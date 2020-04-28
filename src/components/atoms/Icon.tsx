import React, { FC } from 'react';
import {
  rifDirImg, rifComImg, rifGatImg, rifMarImg, rifPayImg, rifStoImg
} from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles';

export const Icons = {
  DOMAINS: rifDirImg,
  COMMUNICATIONS: rifComImg,
  GATEWAY: rifGatImg,
  MARKETPLACE: rifMarImg,
  PAYMENTS: rifPayImg,
  STORAGE: rifStoImg,
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
