import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Footer as RUIFooter } from '@rsksmart/rif-ui';
import { FooterProps } from '@rsksmart/rif-ui/dist/components/organisms/Footer';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 'auto',
  }
}));

const Footer = () => {

  const classes = useStyles();

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
    <div className={classes.root}>
      <RUIFooter {...footerProps} />
    </div>
  )
};

export default Footer;
