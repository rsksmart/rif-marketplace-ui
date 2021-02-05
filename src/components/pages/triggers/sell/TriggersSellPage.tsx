import Typography from '@material-ui/core/Typography'
import ProviderRegistrar from 'components/organisms/triggers/ProviderRegistrar'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC, useState } from 'react'

const TriggersSellPage: FC = () => {
  const [providerAddress, setProviderAddress] = useState('')
  const [endpointUrl, setEndpointUrl] = useState('')

  return (
    <CenteredPageTemplate>
      <Typography gutterBottom variant="h5" color="primary">
        Register as notifications provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {`Fill out the fields below to list your notification service. 
        All the information provided is meant to be true and correct.`}
      </Typography>
      <ProviderRegistrar
        providerAddress={providerAddress}
        onProviderAddrChange={setProviderAddress}
        endpointUrl={endpointUrl}
        onEndpointChange={setEndpointUrl}
      />
    </CenteredPageTemplate>
  )
}

export default TriggersSellPage
