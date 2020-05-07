import React, { FC, HTMLAttributes } from 'react';
import { PageTemplate as RUIPageTemplate } from '@rsksmart/rif-ui';

export interface PageTemplateProps extends HTMLAttributes<HTMLElement> { }

const PageTemplate: FC<PageTemplateProps> = ({
  children,
  ...props
}) => {

  return (
    <RUIPageTemplate {...props}>
      {children}
    </RUIPageTemplate>
  );
};

export default PageTemplate;
