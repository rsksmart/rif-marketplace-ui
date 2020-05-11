import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface FAQPageTemplateProps {
  className?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(3)
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    }
  },
}));

const FAQPageTemplate: FC<FAQPageTemplateProps> = ({ className = '', children }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className}`.trim()}>
      <div className={classes.container}>
        {children}
      </div>
    </div>
  );
};

export default FAQPageTemplate;