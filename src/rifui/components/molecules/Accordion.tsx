import React, { FC, useState } from 'react';
import ExpansionPanel, { ExpansionPanelProps } from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '../../components/atoms';
import { colors } from '../../theme';

interface AccordionProps extends ExpansionPanelProps {
  id: string;
  title?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: 'none',
      color: colors.gray4,
      width: '100%',
    },
    heading: {
      color: colors.gray4,
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      width: '100%'
    },
    expansionPanelSummary: {
      borderBottom: `1px solid ${colors.gray2}`
    }
  })
);

const Accordion: FC<AccordionProps> = ({ children, expanded, id, title, ...rest }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState<boolean>(!!expanded);

  const onChange = () => setIsExpanded(!isExpanded);

  return (
    <ExpansionPanel className={classes.root} expanded={isExpanded} onChange={onChange}>
      <ExpansionPanelSummary className={classes.expansionPanelSummary}
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${id}-content`}
        id={id}
      >
        <Typography className={classes.heading}>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default Accordion;