import Typography from '@material-ui/core/Typography'
import { Web3Store } from '@rsksmart/rif-ui'
import InfoBar from 'components/molecules/InfoBar'
import ProviderEdition from 'components/organisms/notifier/provider/ProviderEdition'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import useConfirmations from 'hooks/useConfirmations'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'

const NotifierEditOfferPage: FC = () => {
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)
  const history = useHistory()
  const hasPendingConfs = Boolean(useConfirmations(
    ['NOTIFIER_REGISTER_PROVIDER'],
  ).length)

  if (!account) {
    history.push(ROUTES.NOTIFIER.BASE)
    return null
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={hasPendingConfs}
        text="Awaiting confirmations for provider registration"
        type="info"
      />
      <Typography gutterBottom variant="h5" color="primary">
        Edit your information as provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {`Fill out the fields below to edit your trigger offer. 
        All the information provided is meant to be true and correct.`}
      </Typography>
      <ProviderEdition isLoading={hasPendingConfs} editMode />
    </CenteredPageTemplate>
  )
}

export default NotifierEditOfferPage
