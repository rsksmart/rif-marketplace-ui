import React, { FC } from 'react';
import Icon, { IconProps } from 'components/atoms/Icon';
import { Button } from 'rifui';
import { NavLink } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface IconedItemProps {
  className: string;
  iconProps: IconProps;
  text: string;
  to: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textDecoration: 'none'
  }
}));

const IconedItem: FC<IconedItemProps> = ({
  className = '',
  to,
  text,
  iconProps,
}) => {
  const classes = useStyles();
  return (
    <NavLink to={to} className={`${classes.root} ${className}`}>
      <Button color='primary'>
        <Icon {...iconProps} />
        {text}
      </Button>
    </NavLink>
  );
};

export default IconedItem;
