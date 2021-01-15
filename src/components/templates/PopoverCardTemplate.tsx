import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import Popover, { PopoverProps } from '@material-ui/core/Popover'
import React, { FC } from 'react'

export type PopoverCardTemplateProps = {
  cardClassName?: string
  cardTitle: string
} & PopoverProps

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: '30px',
    display: 'grid',
    justifyItems: 'center',
  },
  divider: {
    justifySelf: 'normal',
  },
  paper: {
    borderRadius: '30px',
  },
}))

const PopoverCardTemplate: FC<PopoverCardTemplateProps> = (
  {
    cardTitle, cardClassName = '', children, onClose, ...popoverProps
  },
) => {
  const classes = useStyles()
  return (
    <Popover
      PaperProps={{ className: classes.paper }}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...{ onClose }}
      {...popoverProps}
    >
      <Card className={`${classes.card} ${cardClassName}`}>
        <CardHeader
          title={cardTitle}
          titleTypographyProps={{ variant: 'subtitle2', color: 'secondary' }}
        />
        <Divider className={classes.divider} />
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </Popover>
  )
}

export default PopoverCardTemplate
