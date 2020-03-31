import React, { FC } from 'react';

export interface ModalTitleProps extends React.HTMLAttributes<HTMLDivElement> { }

const ModalTitle: FC<ModalTitleProps> = ({ className = '', children, ...props }) => {
  return <div className={`modal-title ${className}`}  {...props}>{children}</div>;
};

export default ModalTitle;
