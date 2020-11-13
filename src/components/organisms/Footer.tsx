import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Footer as RUIFooter } from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { FooterProps } from '@rsksmart/rif-ui/dist/components/organisms/Footer'

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 'auto',
  },
}))

const Footer = () => {
  const classes = useStyles()

  const footerProps: FooterProps = {
    copyrightText: 'Copyright © 2020 IOV Labs. All rights reserved. v1.1.0-dev.1',
    linksColumns: [
      {
        title: 'RIF',
        links: [
          {
            title: 'Services',
            to: 'https://developers.rsk.co/rif/',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Whitepaper',
            to: 'https://www.rifos.org/assets/whitepapers/rif-whitepaper-en.pdf',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'RIF token',
            to: 'https://developers.rsk.co/rif/token/',
            target: '_blank',
            isExternal: true,
          },
        ],
      },
      {
        title: 'RIF Marketplace',
        links: [
          {
            title: 'Roadmap',
            to: 'https://www.rifos.org/marketplace#roadmap',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Articles',
            to: 'https://www.rifos.org/blog',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Follow us',
            to: 'https://twitter.com/rif_os',
            target: '_blank',
            isExternal: true,
          },
        ],
      },
      {
        title: 'Developers',
        links: [
          {
            title: 'Setup Guide',
            to: 'https://github.com/rsksmart/rif-marketplace-dev/blob/master/README.md',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Docs',
            to: 'https://developers.rsk.co/rif/',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Github',
            to: 'https://github.com/rsksmart?q=rif-marketplace',
            target: '_blank',
            isExternal: true,
          },
        ],
      },
      {
        title: 'Privacy',
        links: [
          {
            title: 'Privacy Policy',
            to: 'https://www.rifos.org/privacy-policy',
            target: '_blank',
            isExternal: true,
          },
          {
            title: 'Terms & Conditions',
            to: 'https://www.rifos.org/terms-conditions',
            target: '_blank',
            isExternal: true,
          },
        ],
      },
    ],
  }

  return (
    <div className={classes.root}>
      <RUIFooter {...footerProps} />
    </div>
  )
}

export default Footer
