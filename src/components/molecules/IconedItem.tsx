import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { fonts, Typography } from '@rsksmart/rif-ui';
import Icon, { IconProps } from 'components/atoms/Icon';

export interface IconedItemProps {
  className?: string;
  iconProps: IconProps;
  text: string;
  to: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  iconTitle: {
    display: 'flex',
    justifyContent: 'center',
    '&:hover': {
      fontWeight: fonts.weight.lightBold
    }
  },
  link: {
    textDecoration: 'none',
  },
}));

const IconedItem: FC<IconedItemProps> = ({ className = '', to, text, iconProps }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className}`}>
      <NavLink className={classes.link} to={to}>
        <Icon {...iconProps} />
        <Typography className={classes.iconTitle} variant='h6' color='primary'>{text}</Typography>
      </NavLink>
    </div>
  );
};

export default IconedItem;
