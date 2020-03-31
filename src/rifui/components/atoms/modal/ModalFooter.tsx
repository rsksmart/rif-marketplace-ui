import React, { FC } from 'react';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalFooter: FC<ModalFooterProps> = ({ className = '', children, ...props }) => {
  return <div className={`modal-footer ${className}`}  {...props}>{children}</div>;
};

export default ModalFooter;
