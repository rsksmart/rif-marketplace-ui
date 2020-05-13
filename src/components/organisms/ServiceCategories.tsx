import React, { FC, HTMLAttributes } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ROUTES } from 'routes';
import {
  Grid
} from '@rsksmart/rif-ui';
import IconedItem, { IconedItemProps } from 'components/molecules/IconedItem';
import { Icons } from 'components/atoms/Icon';

export interface ServiceCategoriesProps extends HTMLAttributes<HTMLElement> { };

const useStyles = makeStyles((theme: Theme) => ({
  servicesContainer: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%'
    }
  },
  serviceContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
}))

const ServiceCategories: FC<ServiceCategoriesProps> = () => {
  const classes = useStyles();

  const availableServices: IconedItemProps[] = [
    {
      to: ROUTES.DOMAINS.BUY,
      text: 'Name Services',
      iconProps: { src: Icons.DOMAINS, alt: 'Name Services icon' },
      description: 'Buy/Sell RNS Domains through the RIF Marketplace!'
    },
    {
      to: ROUTES.STORAGE,
      text: 'Storage',
      iconProps: { src: Icons.STORAGE, alt: 'Storage icon' },
      description: 'Offer/Rent Decentralized Storage through the RIF Marketplace!'
    }
  ];

  return (
    <Grid container className={classes.servicesContainer}>
      {!!availableServices.length &&
        availableServices.map((service, i) => (
          <Grid className={classes.serviceContent} item xs={12} lg={6} key={`g${i}`}>
            <IconedItem {...service} key={`i${i}`} />
          </Grid>
        ))}
    </Grid>
  );
}

export default ServiceCategories;
