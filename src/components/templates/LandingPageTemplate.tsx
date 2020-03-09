import Heading from 'components/atoms/Heading';
import React, { FC } from 'react';
import PageTemplate from './PageTemplate';
import ServiceCategories from 'components/organisms/ServiceCategories';

export interface LandingPageTemplateProps {}

export const LandingPageTemplate: FC<LandingPageTemplateProps> = () => {
  return (
    <PageTemplate className="Landing" style={{ textAlign: 'center' }}>
      <Heading className="title" hLevel={1} style={{ marginTop: '2em' }}>
        RIF Marketplace
      </Heading>
      RIF Marketplace provides a digital catalogue with a wide range of
      decentralised services.
      <ServiceCategories />
    </PageTemplate>
  );
};
