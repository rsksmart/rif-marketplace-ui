import React, { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel, { ExpansionPanelProps } from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface AccordionProps extends ExpansionPanelProps {
  id: string;
  title?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      width: '100%'
    }
  })
);

const Accordion: FC<AccordionProps> = ({ children, expanded, id, title, ...rest }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState<boolean>(!!expanded);

  const onChange = () => setIsExpanded(!isExpanded);

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={isExpanded} onChange={onChange}>
        <ExpansionPanelSummary
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
    </div>
  );
}

export default Accordion;