import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import { colors } from '@rsksmart/rif-ui'

export interface PlanItemProps {
  duration: string
  rifPrice: number
}

const useStyles = makeStyles((theme: Theme) => ({
  innerContainer: {
    backgroundColor: colors.gray1,
    borderRadius: 5,
    padding: 10,
  },
}))

const PlanItem: FC<PlanItemProps> = ({ duration, rifPrice }) => {
  const classes = useStyles()

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={10}>
        <Grid
          container
          alignItems="center"
          className={classes.innerContainer}
          // TODO: move to clases
          style={{
          }}
        >
          {/* TODO: remove borderRight on xs devices */}
          <Grid item xs={12} sm={6} style={{ borderRight: `1px solid ${colors.gray3}` }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" textAlign="center" color={`${colors.gray5}`}>
                    {duration}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography align="center" color="primary">
                      {rifPrice}
                      {' '}
                      RIF
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="center" color="secondary">
                      {rifPrice}
                      {' '}
                      USD
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography component="div" variant="caption" color="textSecondary">
                  <Box textAlign="center">
                    Monthly fee
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="div">
                  <Box textAlign="center" color={`${colors.gray5}`}>
                    1234 RIF
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography align="center" color="textSecondary">
                  1234 USD
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Grid container direction="row">
          <IconButton color="primary">
            <ClearIcon />
          </IconButton>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PlanItem
