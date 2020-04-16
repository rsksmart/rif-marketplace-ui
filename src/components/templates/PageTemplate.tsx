import React, { FC, HTMLAttributes } from 'react';

export interface PageTemplateProps extends HTMLAttributes<HTMLElement> {}

const PageTemplate: FC<PageTemplateProps> = ({
  children,
  ...props
}) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

export default PageTemplate;
