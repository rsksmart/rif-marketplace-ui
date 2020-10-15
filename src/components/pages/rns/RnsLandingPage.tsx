import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import SideImageTemplate from 'components/templates/SideImageTemplate'
import Icon, { Icons } from 'components/atoms/Icon'

const RnsLandingPage: FC<{}> = () => {
  const domainsIcon = <Icon src={Icons.DOMAINS} />
  const sideText = (
    <>
      <Typography variant="body1">
        <b>RIF Name Service (RNS)</b>
        {' '}
        enables the use of human readable names for blockchain addresses helping users to receive transactions in personalized domains. New RNS Domains can be obtained through the RNS Manager (
        <a href="https://manager.rns.rifos.org/">https://manager.rns.rifos.org/</a>
        )
      </Typography>
      <br />
      <Typography variant="body1">
        <b>RNS domains</b>
        {' '}
        are seamlessly integrated across RIF Services (Payments, Storage, Communications, etc) and provide the first multi blockchain naming service available for all major blockchains such as Bitcoin, Ethereum and Litecoin among others. In addition, RNS is built on top of RSK, thus it inherits Bitcoin&apos;s decentralized nature and security.
      </Typography>
      <br />
      <Typography variant="body1">
        You can now easily
        <b> Buy and Sell RNS Domains</b>
        {' '}
        through the RIF Marketplace.
        <i>Sellers</i>
        {' '}
        can simply list their owned domains and set a listing price in RIF for each of them (additional payments such as R-BTC, DOC and RDOC will be added soon!).
        <i>Buyers</i>
        {' '}
        can browse the available Domains and purchase the one they prefer by paying the listed priced.
        To ensure transparency and provide security to all parties, the Marketplace acts as an
        <b> escrow</b>
        , ensuring the Domain is released only when a
        <b> valid payment</b>
        {' '}
        is received. At no point in time the Marketplace owns or maintains your domain on hold. You will always have full control of your own Domains.
      </Typography>
    </>
  )
  return (
    <SideImageTemplate mainTitle="Domains" sideIcon={domainsIcon} sideText={sideText} />
  )
}

export default RnsLandingPage
