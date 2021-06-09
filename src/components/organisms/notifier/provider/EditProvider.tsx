import React, { FC, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import RoundBtn from 'components/atoms/RoundBtn'
import { Grid } from '@material-ui/core'
import { ModalDialogue } from '@rsksmart/rif-ui'
import ProviderRegistrar from '../ProviderRegistrar'

type Props = {
  accountStr: string
  onRegister: (url: string) => Promise<void>
}

const EditProvider: FC<Props> = ({
  accountStr, onRegister, children,
}) => {
  const [showConfirmProviderEdit, setShowConfirmProviderEdit] = useState(false)
  const [providerUrl, setProviderUrl] = useState('')

  return (
    <>
      <ModalDialogue
        title="Confirm Provider Update"
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
          <Box p={3}>
            <Typography
              gutterBottom
              color="error"
              align="center"
            >
              Your existing subscriptions and plans will be affected
            </Typography>
            <Typography gutterBottom color="secondary">
              As a result of this operation, if the new url contains a different set of subscription plans than the current set of plans in marketplace, the current marketplace plans will be set to inactive, and any subscriptions that belong to those plans will be affected.
            </Typography>
          </Box>
          <Box>
            <RoundBtn onClick={(): Promise<void> => onRegister(providerUrl)}>Confirm</RoundBtn>
          </Box>
        </Grid>
      </ModalDialogue>
      <Typography gutterBottom variant="h5" color="primary">
        Edit your information as provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the fields below to edit your trigger offer. All the information provided is meant to be true and correct.
      </Typography>
      <ProviderRegistrar
        providerAddress={accountStr}
        isEnabled
        onRegister={({ endpointUrl }): void => {
          setShowConfirmProviderEdit(true)
          setProviderUrl(endpointUrl)
        }}
        buttonLabel="Edit Offer"
      />
      { children}
    </>
  )
}

export default EditProvider
