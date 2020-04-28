import React, { FC } from 'react';
import ServiceCategories from 'components/organisms/ServiceCategories';
import PageTemplate from './PageTemplate';
import { Typography } from '@rsksmart/rif-ui';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface LandingPageTemplateProps { }

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center'
  },
  heading: {
    marginTop: theme.spacing(2)
  }
})
);

export const LandingPageTemplate: FC<LandingPageTemplateProps> = () => {
  const classes = useStyles();
  return (
    <PageTemplate className={classes.root}>
      <Typography className={classes.heading} color='primary' variant='h1'>
        RIF Marketplace
      </Typography>
      <Typography variant='body1'>
        RIF Marketplace provides a digital catalogue with a wide range of
        decentralised services.
      </Typography>
      <ServiceCategories />
    </PageTemplate>
  );
};
