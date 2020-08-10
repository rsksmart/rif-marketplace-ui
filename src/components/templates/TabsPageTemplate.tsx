import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Typography, Box } from '@material-ui/core'
import StyledTab from 'components/atoms/StyledTab'
import StyledTabs from 'components/molecules/StyledTabs'
import { TabProps as MUITabProps } from '@material-ui/core/Tab'
import { useHistory } from 'react-router-dom'

export interface TabsPageTemplateProps {
  title: string
  tabs: NavTabProps[]
}

export interface NavTabProps extends MUITabProps {
  label: string
  value: number
  to: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}))

const TabsPageTemplate: FC<TabsPageTemplateProps> = ({ title, tabs, children }) => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const history = useHistory()

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

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
        <StyledTabs value={value} onChange={handleChange}>
          {
            tabs.map((tab) => (
              <StyledTab
                {...tab}
                key={tab.value}
                onClick={() => history.replace(tab.to)}
              />
            ))
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
