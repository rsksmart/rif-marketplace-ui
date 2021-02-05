import TextField from '@material-ui/core/TextField'
import GridRow from 'components/atoms/GridRow'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'
import React, { FC } from 'react'
import CenteredContent from 'components/molecules/CenteredContent'
import RoundBtn from 'components/atoms/RoundBtn'
import GridItem from 'components/atoms/GridItem'
import Typography from '@material-ui/core/Typography'

type ProviderRegistrarProps = {
  providerAddress: string
  onProviderAddrChange: (address: string) => void
  endpointUrl: string
  onEndpointChange: (endpoint: string) => void
}

const ProviderRegistrar: FC<ProviderRegistrarProps> = ({
  providerAddress,
  onProviderAddrChange,
  endpointUrl,
  onEndpointChange,
}) => (
  <GridRow justify="center">
    <TitledRoundedCard
      title="General features"
      titleProps={{ variant: 'h6', color: 'primary', align: 'left' }}
      roundedCardProps={{ color: 'primary' }}
    >
      <CenteredContent>
        <GridRow spacing={3}>
          <GridItem xs={12}>
            <TextField
              required
              fullWidth
              label="Provider address"
              value={providerAddress}
              inputProps={{
                style: { textAlign: 'center' },
              }}
              onChange={(
                { target: { value } },
              ): void => onProviderAddrChange(value)}
            />
          </GridItem>
          <GridItem xs={12}>
            <TextField
              required
              fullWidth
              label="Endpoint url"
              value={endpointUrl}
              inputProps={{
                style: { textAlign: 'center' },
              }}
              onChange={
                ({ target: { value } }): void => onEndpointChange(value)
              }
            />
          </GridItem>
          <GridItem xs={12}>
            <GridRow justify="center" spacing={2}>
              <RoundBtn>
                Register provider
              </RoundBtn>
              <Typography
                color="secondary"
                variant="subtitle1"
                align="center"
                gutterBottom
              >
                {`Your wallet will open and you will be asked to confirm
             the transaction for listing your service.`}
              </Typography>
            </GridRow>
          </GridItem>
        </GridRow>
      </CenteredContent>
    </TitledRoundedCard>
  </GridRow>
)

export default ProviderRegistrar
