import React, { FC } from 'react';
import Icon, { IconProps } from 'components/atoms/Icon';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

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
    <LinkContainer to={to} className={`iconedItem ${className}`}>
      <Button
        variant="link"
        style={{
          color: '#008cff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Icon {...iconProps} />
        {text}
      </Button>
    </LinkContainer>
  );
};

export default IconedItem;
