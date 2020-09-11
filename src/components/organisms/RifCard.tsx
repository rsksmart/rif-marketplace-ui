import {
  makeStyles, Theme, CardProps, Card, Grid, CardContent, CardActions, CardActionArea,
} from '@material-ui/core'
import React, { FC } from 'react'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import { Button } from '@rsksmart/rif-ui'

const useStylesRifCard = makeStyles((theme: Theme) => ({
  card: {
    background: '#F8F7F7',
    borderRadius: '20px',
    minWidth: '--webkit-fill-available',
    border: '0px',
    width: '100%',
  },
  contentContainer: {
    margin: '50px',
    marginTop: '10px',
    background: '#FFF',
    borderRadius: '20px',
  },
  classActions: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

export type RifCardProps = CardProps & {
    Header?: React.ElementType
    Actions: React.ElementType
}

const RifCard: FC<RifCardProps> = ({
  children, Header, Actions, ...props
}) => {
  const classes = useStylesRifCard()
  return (
    <Card className={classes.card} variant="outlined" {...props}>
      <GridColumn
        alignContent="center"
        justify="center"
      >
        {!!Header && (<GridItem style={{ alignSelf: 'center' }}><Header /></GridItem>)}
        <GridItem>
          <CardContent className={classes.contentContainer}>
            {children}

            <CardActions className={classes.classActions}>
              <Actions />
            </CardActions>
          </CardContent>
        </GridItem>
        <GridItem />
      </GridColumn>
    </Card>
  )
}

export default RifCard
