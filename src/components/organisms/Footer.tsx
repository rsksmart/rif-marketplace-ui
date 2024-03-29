import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLinkProps } from 'react-router-dom/NavLink'
import { Footer as RUIFooter } from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { FooterProps as RUIFooterProps } from '@rsksmart/rif-ui/dist/components/organisms/Footer'
import { appVersion } from 'config'
import PrivacySettingsModal from './tracking/PrivacySettingsModal'

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 'auto',
  },
}))

type FooterProps = RUIFooterProps & NavLinkProps

const Footer: FC = () => {
  const classes = useStyles()

  const footerProps: FooterProps = {
    copyrightText: `Copyright © ${new Date().getFullYear()} IOV Labs. All rights reserved. v${appVersion}`,
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
        title: 'Marketplace',
        links: [
          {
            title: 'Roadmap',
            to: 'https://www.rifos.org/roadmap',
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
            title: `Version ${appVersion}`,
            to: `https://github.com/rsksmart/rif-marketplace-ui/releases/tag/v${appVersion}`,
            target: '_blank',
            isExternal: true,
          },
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
      <PrivacySettingsModal />
      <RUIFooter {...footerProps} />
    </div>
  )
}

export default Footer
