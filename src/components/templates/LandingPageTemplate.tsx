import React, { FC } from 'react';
import ServiceCategories from 'components/organisms/ServiceCategories';
import {
  HeaderTongue, Typography
} from '@rsksmart/rif-ui';
import { HeaderTongueProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/HeaderTongue';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface LandingPageTemplateProps { }

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2, 0),
    width: '100%',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
}));

const headerTongueProps: HeaderTongueProps = {
  titleLine1: 'Your marketplace',
  titleLine2: 'for decentralized services',
  description: `RIF Marketplace provides a digital catalog with a wide range of decentralized service 
      listings, allowing providers to publish their services and engage with users in a secure and efficient way.`
}

export const LandingPageTemplate: FC<LandingPageTemplateProps> = () => {
  const classes = useStyles();
  return (
    <>
      <HeaderTongue {...headerTongueProps} />
      <div className={classes.root}>
        <div className={classes.titleContainer}>
          <Typography color='primary' variant='h4'>RIF Marketplace services</Typography>
        </div>
        <ServiceCategories />
      </div>
    </>
  );
};
