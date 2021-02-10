import Typography from '@material-ui/core/Typography'
import ProviderRegistrar from 'components/organisms/triggers/ProviderRegistrar'
import WithLoginCard from 'components/hoc/WithLoginCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC } from 'react'
import Logger from 'utils/Logger'
import Staking from 'components/organisms/triggers/Staking'

const logger = Logger.getInstance()

const TriggersSellPage: FC = () => {
  const handleRegistration = ({ endpointUrl, providerAddress }): void => {
    logger.debug({ endpointUrl })
    logger.debug({ providerAddress })
    // TODO: interact with the SC
  }

  return (
    <CenteredPageTemplate>
      <Staking />
      <Typography gutterBottom variant="h5" color="primary">
        Register as notifications provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {`Fill out the fields below to list your notification service. 
        All the information provided is meant to be true and correct.`}
      </Typography>
      <ProviderRegistrar onRegister={handleRegistration} />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: TriggersSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
