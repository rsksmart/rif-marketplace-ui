import React, { FC } from 'react';

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalHeader: FC<ModalHeaderProps> = ({ className = '', children, ...props }) => {
  return <div className={`modal-header ${className}`}  {...props}>{children}</div>;
};

export default ModalHeader;
