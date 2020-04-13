import React, { FC } from 'react';
import Icon, { IconProps } from 'components/atoms/Icon';
import { Button } from 'rifui';
import { NavLink } from 'react-router-dom'

export interface IconedItemProps {
  className: string;
  to: string;
  text: string;
  iconProps: IconProps;
}

const IconedItem: FC<IconedItemProps> = ({
  className = '',
  to,
  text,
  iconProps,
}) => {
  return (
    <NavLink to={to} className={`iconedItem ${className}`}>
      <Button
        style={{
          color: '#008cff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Icon {...iconProps} />
        {text}
      </Button>
    </NavLink>
  );
};

export default IconedItem;
