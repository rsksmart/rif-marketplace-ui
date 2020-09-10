import {
  Card, CardContent, CardProps, Grid, GridProps,

  makeStyles, Step, StepLabel, Stepper,

  Tab, Tabs,

  TextField, Theme,
} from '@material-ui/core'
import { Button, Typography } from '@rsksmart/rif-ui'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import React, { FC } from 'react'
import { Modify } from 'utils/typeUtils'

const GridRow: FC<Omit<GridProps, 'direction' | 'container' | 'item'>> = ({ children, ...props }) => (
  <Grid
    container
    alignItems="baseline"
    justify="flex-start"
    direction="row"
    wrap="nowrap"
    style={{
      paddingBlockEnd: '1.5em',
    }}
    spacing={5}
    {...props}
  >
    {React.Children.map(children, (child) => <Grid item>{child}</Grid>)}
  </Grid>
)

const GridColumn: FC<Omit<GridProps, 'direction' | 'container' | 'item'>> = ({ children, ...props }) => (
  <Grid
    container
    direction="column"
    {...props}
  >
    {children}
  </Grid>
)

const GridItem: FC<Omit<GridProps, 'direction' | 'container' | 'item'>> = ({ children, ...props }) => <Grid item {...props}>{children}</Grid>

const ItemValuePair: FC<Modify<Partial<GridProps>, { item: string, value: string }>> = ({ item, value, ...props }) => (
  <GridRow
    alignItems="baseline"
    wrap="nowrap"
    spacing={2}
    {...props}
  >
    <GridItem>
      <Typography
        color="primary"
        align="center"
      >
        {`${item}:`}
      </Typography>
    </GridItem>
    <GridItem>
      <Typography
        color="secondary"
        align="center"
        style={{
          fontSize: '1.2rem',
        }}
      >
        {value}
      </Typography>
    </GridItem>
  </GridRow>
)

const useStylesDropZone = makeStyles((theme: Theme) => ({
  root: {
    borderRadius: '10px',
    border: '1px dashed #CFD3DA',
    boxSizing: 'border-box',

    width: '296px',
    height: '118px',
    left: '563px',
    top: '623px',
  },
}))
const DropZone: FC = () => {
  const classes = useStylesDropZone()
  return (
    <GridColumn
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <GridItem>Drag & Drop files here</GridItem>
      <GridItem>or</GridItem>
      <GridItem>
        <Button onClick={() => { console.log('Add files button clicked') }}>
          + Add files
        </Button>
      </GridItem>
    </GridColumn>
  )
}

const useStylesRifCard = makeStyles((theme: Theme) => ({
  card: {
    background: '#F8F7F7',
    borderRadius: '20px',
    minWidth: '--webkit-fill-available',
  },
  contentContainer: {
    margin: '50px',
    marginTop: '10px',
    background: '#FFF',
  },
}))
const RifCard: FC<Modify<CardProps, { Header?: React.ElementType }>> = ({ children, Header, ...props }) => {
  const classes = useStylesRifCard()
  return (
    <Card className={classes.card} {...props}>
      <GridColumn
        alignContent="center"
      >
        {!!Header && (<Grid item><Header /></Grid>)}
        <GridItem>
          <CardContent className={classes.contentContainer}>
            {children}
          </CardContent>
        </GridItem>
      </GridColumn>
    </Card>
  )
}

const HashTab = () => (
  <Tabs
    value={0}
    onChange={() => { console.log('Changed tab') }}
    classes={{

    }}
    indicatorColor="primary"
    textColor="primary"
  >
    <Tab label="Upload file" />
    <Tab label="Pin by hash" />
  </Tabs>
)

const StorageOffersCheckoutPage = () => (
  <CheckoutPageTemplate
    className="storage-checkout-page"
    backButtonProps={{
      backTo: 'offers',
    }}
  >
    <GridColumn
      className="rootContainer"
    >
      <GridRow>
        <ItemValuePair
          item="Selected storage provider"
          value="Provider.RSK"
        />
        <ItemValuePair
          item="System"
          value="IPFS"
        />
      </GridRow>
      <GridRow>
        <Typography color="textPrimary" weight="lightBold">
          The size of your storage plan is calculated by the content that you upload/persist in this first step.
        </Typography>
      </GridRow>
      {/* STEPPER */}
      <Stepper
        {...{}}
      >
        <Step>
          <StepLabel>Upload/Pin content</StepLabel>
        </Step>
        <Step>
          <StepLabel>Configure your storage plan</StepLabel>
        </Step>
      </Stepper>
      {/* CONTENT */}
      <GridColumn alignContent="center">
        <RifCard Header={HashTab}>
          <GridColumn>
            <GridItem>
              <GridRow>
                <GridItem>
                  <TextField id="contentName" label="Content name" variant="outlined" />
                </GridItem>
              </GridRow>
            </GridItem>
            <GridItem>
              <GridRow>
                <DropZone />
              </GridRow>
            </GridItem>
          </GridColumn>
        </RifCard>
      </GridColumn>
    </GridColumn>
  </CheckoutPageTemplate>
)

export default StorageOffersCheckoutPage
