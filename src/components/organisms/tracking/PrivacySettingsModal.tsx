import React, { FC, useEffect, useState } from 'react'
import {
  Button,
  colors,
} from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import useTracking from 'hooks/useTracking'
import Logger from 'utils/Logger'
import { TRACKING_DATA_DOMAIN } from 'config'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Portal from '@material-ui/core/Portal/Portal'
import Box from '@material-ui/core/Box/Box'
import Typography from '@material-ui/core/Typography/Typography'
import Link from '@material-ui/core/Link/Link'
import { Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: 'fixed',
    bottom: '0px',
    backgroundColor: '#F2F2F2',
    border: 'none',
    borderRadius: '20px 20px 0px 0px',
    boxShadow: theme.shadows[5],
    color: colors.gray5,
  },
  titleBox: {
    margin: '0px',
    height: '46px',
    borderRadius: '20px 20px 0px 0px',
    backgroundColor: colors.gray3,
    color: '#4D4C4C',
    justifySelf: 'center',
  },
  title: {
    margin: 'auto',
    padding: '10px',
  },

  descriptionBox: {
    padding: '10px',
    paddingRight: '75px',
  },
  actions: {
    marginBottom: '1rem',
    paddingRight: '75px',
  },
}))

type PrivacySettings = {
  tracking: boolean
}

const PrivacySettingsModal: FC = () => {
  const classes = useStyles()
  const settingsString = localStorage.getItem('privacySettings')
  const [isOpen, setIsOpen] = useState(true)
  const [settings, setSettings] = useState<PrivacySettings>()

  useTracking({
    activated: Boolean(settings?.tracking),
    dataDomain: TRACKING_DATA_DOMAIN,
  })

  useEffect(() => {
    if (settingsString) {
      try {
        const privacySettings = JSON.parse(settingsString)
        setSettings(privacySettings)
        setIsOpen(!privacySettings)
      } catch {
        Logger.getInstance().error('Something unexpected happened with the privacy settings object stored in the local storage.')
      }
    }
  }, [settingsString])

  const handleSelect = (allow: boolean) => (): void => {
    localStorage.setItem('privacySettings', JSON.stringify({
      tracking: allow,
    }))
    setIsOpen(false)
  }

  return isOpen ? (
    <Portal>
      <GridColumn className={classes.paper}>
        <GridItem xs={12}>
          <Box className={classes.titleBox}>
            <Typography className={classes.title} align="left">
              Privacy settings
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={12}>
          <Box className={classes.descriptionBox}>
            <GridColumn spacing={2}>
              <GridItem>
                <Typography align="left">
                  In order to improve the user&apos;s experience,
                  {' '}
                  this site uses Plausible, an open source and privacy-friendly
                  {' '}
                  tool, which does not use cookies and is compliant with GDPR,
                  {' '}
                  CCPA and PECR. We analyse your activity and our traffic.
                  {' '}
                  We strive to collect only the data that we need.
                  {' '}
                  We do not share your information with third parties;
                  {' '}
                  we want to better understand your behaviour in order
                  {' '}
                  to improve our website. Please take a moment to familiarize
                  {' '}
                  yourself with Plausible’s and our policies, accessible at
                  {' '}
                  <Link href="https://plausible.io/data-policy">https://plausible.io/data-policy</Link>
                  {' '}
                  and
                  {' '}
                  <Link href="https://www.rsk.co/privacy-policy">https://www.rsk.co/privacy-policy</Link>
                  .
                </Typography>
              </GridItem>
              <GridItem>
                <Typography align="left">
                  If you accept Plausible’s and ours policy, please click
                  {' '}
                  <u>Accept</u>
                  .
                </Typography>
              </GridItem>
              <GridItem>
                <Typography align="left">
                  If you do not accept Plausible’s and ours policy,
                  {' '}
                  we provide you with the means to disable our tracking system,
                  {' '}
                  please click
                  {' '}
                  <u>Reject</u>
                  .
                </Typography>
                <Typography align="left" color="primary">
                  Certain features of the site may not be available if the
                  {' '}
                  tracking system is disabled.*
                </Typography>
              </GridItem>
            </GridColumn>
          </Box>
        </GridItem>
        <GridItem className={classes.actions}>
          <GridRow justify="flex-end" spacing={3}>
            <GridItem xs={1}>
              <Button
                fullWidth
                rounded
                id="reject-btn"
                variant="contained"
                color="secondary"
                onClick={handleSelect(false)}
              >
                Reject
              </Button>
            </GridItem>
            <GridItem xs={1}>
              <Button
                fullWidth
                rounded
                id="accept-btn"
                variant="contained"
                color="primary"
                onClick={handleSelect(true)}
              >
                Accept
              </Button>
            </GridItem>
          </GridRow>
        </GridItem>
      </GridColumn>
    </Portal>
  ) : null
}

export default PrivacySettingsModal
