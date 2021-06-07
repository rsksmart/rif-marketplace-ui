import React, { FC, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import RoundBtn from 'components/atoms/RoundBtn'
import { Grid } from '@material-ui/core'
import RifDialog from 'components/organisms/RifDialog'
import ProviderRegistrar from '../ProviderRegistrar'

type Props = {
  isWhitelistedProvider: boolean
  accountStr: string
  onRegister: (string) => Promise<void>
}

const EditProvider: FC<Props> = ({
  isWhitelistedProvider, accountStr, onRegister, children,
}) => {
  const [showConfirmProviderEdit, setShowConfirmProviderEdit] = useState(false)
  const [providerUrl, setProviderUrl] = useState('')

  return (
    <>
      <RifDialog
        open={showConfirmProviderEdit}
        onClose={(): void => { setShowConfirmProviderEdit(false) }}
      >
        <Grid
          container
          spacing={2}
          wrap="nowrap"
          direction="column"
          alignItems="center"
        >
          <Box pt={4}>
            <Typography gutterBottom variant="h5" color="primary">
              Confirm Provider Update
            </Typography>
          </Box>
          <Box pt={8} pl={3} pr={3}>
            <Typography gutterBottom color="error">Your existing subscriptions and plans will be affected</Typography>
            <Typography gutterBottom color="secondary">
              As a result of this operation, if the new url contains a different set of subscription plans than the current set of plans in marketplace, the current marketplace plans will be set to inactive, and any subscriptions that belong to those plans will be affected.
            </Typography>
          </Box>
          <Box pt={4}>
            <RoundBtn onClick={(): Promise<void> => onRegister(providerUrl)}>Confirm</RoundBtn>
          </Box>
        </Grid>
      </RifDialog>
      <Typography gutterBottom variant="h5" color="primary"> Edit your information as provider    </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the fields below to edit your trigger offer. All the information provided is meant to be true and correct.
      </Typography>
      <ProviderRegistrar
        providerAddress={accountStr}
        isEnabled={isWhitelistedProvider}
        onRegister={({ endpointUrl }): void => {
          setShowConfirmProviderEdit(true)
          setProviderUrl(endpointUrl)
        }}
        buttonLabel="Edit Offer"
      />
      {children}
    </>
  )
}

export default EditProvider
