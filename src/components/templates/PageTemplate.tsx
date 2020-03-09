import React, { FC, HTMLAttributes } from 'react';

export interface PageTemplateProps extends HTMLAttributes<HTMLElement> {}

const PageTemplate: FC<PageTemplateProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={`${className}-page`} {...props}>
      {children}
    </div>
  );
};

export default PageTemplate;
