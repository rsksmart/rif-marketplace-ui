import React, { FC, useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { colors, fonts } from '@rsksmart/rif-ui'

export interface FAQSectionProps {
  answer: string
  initiallyExpanded?: boolean
  question: string
  className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: 'none',
    color: colors.gray4,
    width: '100%',
  },
  heading: {
    display: 'flex',
    justifyContent: 'center',
    color: colors.gray5,
    fontSize: fonts.size.subtitleSmall,
    width: '100%',
  },
  headingExpanded: {
    color: colors.primary,
  },
  headingCollapsed: {
    fontWeight: fonts.weight.regular,
  },
  panelDetails: {
    display: 'flex',
    justifyContent: 'center',
  },
  answerContainer: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
  },
  answerText: {
    color: colors.gray5,
  },
}))

const FAQSection: FC<FAQSectionProps> = ({
  className = '', initiallyExpanded, question, answer,
}) => {
  const classes = useStyles()
  const [isExpanded, setIsExpanded] = useState(!!initiallyExpanded)

  const onChange = (): void => setIsExpanded(!isExpanded)

  return (
    <Accordion className={`${classes.root} ${className}`.trim()} expanded={isExpanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={isExpanded ? <RemoveIcon /> : <AddIcon />}
      >
        <Typography className={`${classes.heading} ${isExpanded ? classes.headingExpanded : classes.headingCollapsed}`.trim()}>{question}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.panelDetails}>
        <div className={classes.answerContainer}>
          <Typography className={classes.answerText}>{answer}</Typography>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default FAQSection
