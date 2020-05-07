import React from 'react';
import { Footer as RUIFooter } from '@rsksmart/rif-ui';
import { FooterProps } from '@rsksmart/rif-ui/dist/components/organisms/Footer';

const Footer = () => {

  const footerProps: FooterProps = {
    copyrightText: 'Copyright © 2020 IOV Labs. All rights reserved. v0.1.0',
    linksColumns: [
      {
        title: 'RIF',
        links: [{
          title: 'Services',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'Whitepaper',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'RIF token',
          to: 'https://developers.rsk.co/rif/'
        }]
      },
      {
        title: 'RIF Marketplace',
        links: [{
          title: 'Services',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'Whitepaper',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'RIF token',
          to: 'https://developers.rsk.co/rif/'
        }]
      },
      {
        title: 'Developers',
        links: [{
          title: 'Services',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'Whitepaper',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'RIF token',
          to: 'https://developers.rsk.co/rif/'
        }]
      },
      {
        title: 'Privacy',
        links: [{
          title: 'Services',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'Whitepaper',
          to: 'https://developers.rsk.co/rif/'
        },
        {
          title: 'RIF token',
          to: 'https://developers.rsk.co/rif/'
        }]
      }
    ]
  }

  return (
    <RUIFooter {...footerProps} />
  )
};

export default Footer;
