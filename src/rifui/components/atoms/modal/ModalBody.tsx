import React, { FC } from 'react';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalBody: FC<ModalBodyProps> = ({ className = '', children, ...props }) => {
  return <div className={`modal-body ${className}`} {...props}>{children}</div>;
};

export default ModalBody;
