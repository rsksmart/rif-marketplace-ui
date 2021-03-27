import { Typography } from '@material-ui/core'
import Icon, { Icons } from 'components/atoms/Icon'
import SideImageTemplate from 'components/templates/SideImageTemplate'
import React, { FC } from 'react'

const NotifierLandingPage: FC = () => {
  const icon = <Icon src={Icons.NOTIFIER} />
  const sideText = (
    <>
      <Typography variant="body1">
        <b>RIF Notification services</b>
        {' '}
        allow users to subscribe to blockchain events and trigger actions in
        {' '}
        the external world. By permanently checking the blockchain status based
        {' '}
        on pre-defined configurations, users can receive e-mails, SMS, and API
        {' '}
        calls from different providers, in a secure and efficient way.
      </Typography>
      <br />
      <Typography variant="body1">
        RIF Marketplace allows Providers of notifications (
        <b>Notifiers</b>
        ) to offer subscription plans to users including a
        {' '}
        <b>total number of notifications and notification methods</b>
        {' '}
        (SMS, E-mail, API calls, etc). Consumers can browse the available plans
        {' '}
        and create subscriptions for the notifications they require, which
        {' '}
        may include
        {' '}
        <b>
          new blocks, new transactions, and/or
          {' '}
          specific smart contract events
        </b>
        .
      </Typography>
      <br />
      <Typography variant="body1">
        The service is implemented through a
        {' '}
        <b>Smart Contract</b>
        {' '}
        that handles
        {' '}
        <b>Notification Subscriptions</b>
        {' '}
        for consumers and providers in a transparent and decentralized
        {' '}
        way. The RIF Notifier service connects to the Blockchain,
        {' '}
        listens to new subscriptions and starts emitting notifications
        {' '}
        to users in an automated manner.
      </Typography>
    </>
  )
  return (
    <SideImageTemplate mainTitle="Notifications" sideIcon={icon} sideText={sideText} />
  )
}

export default NotifierLandingPage
