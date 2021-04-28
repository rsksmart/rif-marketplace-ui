/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import { CopyTextTooltip, shortenString, TooltipIconButton } from '@rsksmart/rif-ui'
import DescriptionCard from 'components/molecules/DescriptionCard'
import RifAddress from 'components/molecules/RifAddress'
import React, {
  FC,
} from 'react'
import { removeURLProtocol } from 'utils/stringUtils'

export type Profile = { address: string, url: string } | undefined
type Props = {
    myProfile: Profile
    handleEditProfile?: React.MouseEventHandler<HTMLButtonElement>
    account?: string
}

const NotifierProviderDescription: FC<Props> = ({ myProfile, handleEditProfile, account }) => (
  <DescriptionCard>
    <Grid container spacing={1}>
      <Grid item xs={4} md={5}>
        <Typography color="primary" noWrap>Your profile</Typography>
      </Grid>
      <Grid item xs={4} md={7}>
        <Typography color="primary" noWrap>
          <TooltipIconButton
            icon={<EditOutlinedIcon />}
            iconButtonProps={{
              onClick: handleEditProfile,
              style: {
                padding: 0,
                margin: 0,
              },
            }}
            tooltipTitle="Edit Profile"
          />
        </Typography>
      </Grid>
      <Grid item xs={4} md={5}>
        <Typography color="textPrimary" noWrap>Provider address</Typography>
      </Grid>
      <Grid item xs={4} md={7}>
        <RifAddress value={account || ''} color="textSecondary" noWrap />
      </Grid>
      <Grid item xs={4} md={5}>
        <Typography color="textPrimary" noWrap>End-point URL</Typography>
      </Grid>
      <Grid item xs={4} md={7}>
        <CopyTextTooltip
          fullText={myProfile?.url || ''}
          displayElement={(
            <Typography color="textSecondary" noWrap>
              {myProfile && shortenString(removeURLProtocol(myProfile.url) || '', 20, 20)}
            </Typography>
)}
        />
      </Grid>
    </Grid>
  </DescriptionCard>
)

export default NotifierProviderDescription
