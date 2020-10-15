import React, { FC } from 'react'
import {
  Card, CardActions, CardContent, CardProps, makeStyles, Theme,
} from '@material-ui/core'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import { colors } from '@rsksmart/rif-ui'

const useStylesRifCard = makeStyles((theme: Theme) => ({
  card: {
    background: colors.gray1,
    borderRadius: '20px',
    minWidth: '--webkit-fill-available',
    border: '0px',
    width: '100%',
  },
  titleContainer: {
    padding: theme.spacing(3),
  },
  contentContainer: {
    width: '395px',
    minHeight: '276px',
    margin: '50px',
    marginTop: '10px',
    background: colors.white,
    borderRadius: '20px',
    display: 'grid',
    alignContent: 'space-between',
  },
  classActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  headerItem: {
    alignSelf: 'center',
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
        className={classes.titleContainer}
      >
        {!!Header && (
        <GridItem className={classes.headerItem}>
          <Header />
        </GridItem>
        )}
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
