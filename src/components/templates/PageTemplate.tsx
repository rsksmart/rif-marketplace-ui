import React, { FC, HTMLAttributes } from 'react'
import { PageTemplate as RUIPageTemplate } from '@rsksmart/rif-ui'

export type PageTemplateProps = HTMLAttributes<HTMLElement>

const PageTemplate: FC<PageTemplateProps> = ({
  children,
  ...props
}) => (
  <RUIPageTemplate {...props}>
    {children}
  </RUIPageTemplate>
)

export default PageTemplate
