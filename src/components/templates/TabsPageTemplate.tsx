import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { StyledNavTab, StyledTabs } from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'

export interface TabsPageTemplateProps {
  tabs: StyledNavTabProps[]
  title: string
  value: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  childrenContent: {
    marginTop: theme.spacing(3),
  },
}))

const TabsPageTemplate: FC<TabsPageTemplateProps> = ({
  title, tabs, children, value,
}) => {
  const classes = useStyles()

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
        <StyledTabs value={value}>
          {
            tabs.map((tab) => <StyledNavTab key={tab.label} {...tab} />)
          }
        </StyledTabs>
      </Grid>
      <Grid className={classes.childrenContent} container>
        {children}
      </Grid>
    </Grid>
  )
}

export default TabsPageTemplate
