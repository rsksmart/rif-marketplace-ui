import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import ProviderRegistrar from '../ProviderRegistrar'
import Staking from '../Staking'

type Props = {
  isWhitelistedProvider: boolean
  accountStr: string
  onRegister: (string) => Promise<void>
}

const AddProvider: FC<Props> = ({
  isWhitelistedProvider, accountStr, onRegister, children,
}) => (
  <>
    <Staking isEnabled={isWhitelistedProvider} />
    <Typography gutterBottom variant="h5" color="primary">
      Register as notifications provider
    </Typography>
    <Typography gutterBottom color="secondary" variant="subtitle1">
      Fill out the fields below to list your notification service.  All the information provided is meant to be true and correct.
    </Typography>
    <ProviderRegistrar
      providerAddress={accountStr}
      isEnabled={isWhitelistedProvider}
      onRegister={({ endpointUrl }): void => {
        onRegister(endpointUrl)
      }}
    />
    {children}
  </>
)

export default AddProvider
