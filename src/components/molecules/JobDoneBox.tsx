import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { colors, tickWideImg } from '@rsksmart/rif-ui'

export interface JobDoneBoxProps {
    text: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  body: {
    border: `1px solid ${colors.primary}`,
    borderRadius: 12,
    boxSizing: 'border-box',
    color: colors.primary,
    display: 'flex',
    flexDirection: 'column',
    height: 120,
    justifyContent: 'center',
    margin: theme.spacing(1),
    textAlign: 'center',
    width: 222,
  },
}))

const JobDoneBox: FC<JobDoneBoxProps> = ({ text }) => {
  const classes = useStyles()

  return (
    <div className={classes.body}>
      <img src={tickWideImg} alt="done" />
      <p>{text}</p>
    </div>
  )
}

export default JobDoneBox
