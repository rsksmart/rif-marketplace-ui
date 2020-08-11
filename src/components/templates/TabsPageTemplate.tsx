import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import StyledTabs from 'components/molecules/StyledTabs'
import { useHistory } from 'react-router-dom'
import StyledNavTab, { StyledNavTabProps } from 'components/atoms/StyledNavTab'

export interface TabsPageTemplateProps {
  initialValue: string
  tabs: StyledNavTabProps[]
  title: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}))

const TabsPageTemplate: FC<TabsPageTemplateProps> = ({
  title, tabs, children,
}) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Grid className={classes.root} container alignContent="center" alignItems="center">
      <Grid item xs={3}>
        <Typography component="div" color="primary" variant="h5" align="center">
          <Box fontWeight="fontWeightMedium">
            {title}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <StyledTabs value={history.location.pathname}>
          {
            tabs.map((tab) => <StyledNavTab key={tab.label} {...tab} />)
          }
        </StyledTabs>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  )
}

export default TabsPageTemplate
