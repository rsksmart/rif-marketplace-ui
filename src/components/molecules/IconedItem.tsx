import React, { FC } from 'react';
import Icon, { IconProps } from 'components/atoms/Icon';

export interface IconedItemProps {
  className: string;
  text: string;
  iconProps: IconProps;
}

const IconedItem: FC<IconedItemProps> = ({
  className = '',
  text,
  iconProps,
}) => {
  return (
    <div className={`iconedItem ${className}`.trim()}>
      <Icon {...iconProps} />
      {text}
    </div>
  );
};

export default IconedItem;
