import React, { FC, HTMLAttributes } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ROUTES } from 'routes';
import { Typography } from 'rifui';
import IconedItem, { IconedItemProps } from 'components/molecules/IconedItem';
import { Icons } from 'components/atoms/Icon';

export interface ServiceCategoriesProps extends HTMLAttributes<HTMLElement> { };

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    textAlign: 'left'
  },
  iconedItemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: theme.spacing(1),
  }
}))

const ServiceCategories: FC<ServiceCategoriesProps> = () => {
  const classes = useStyles();

  const availableServices: IconedItemProps[] = [
    {
      className: 'nameService',
      to: ROUTES.DOMAINS.BUY,
      text: 'Name Service',
      iconProps: { name: Icons.DOMAINS },
    },
    {
      className: 'storage',
      to: ROUTES.STORAGE,
      text: 'Storage',
      iconProps: { name: Icons.STORAGE },
    },
    {
      className: 'payments',
      to: ROUTES.PAYMENTS,
      text: 'Payments',
      iconProps: { name: Icons.PAYMENTS },
    },
    {
      className: 'dataService',
      to: ROUTES.DATA_SERVICE,
      text: 'Data Services',
      iconProps: { name: Icons.GATEWAY },
    },
    {
      className: 'communications',
      to: ROUTES.COMMUNICATIONS,
      text: 'Communications',
      iconProps: { name: Icons.COMMUNICATIONS },
    },
  ];

  return (
    <div className={classes.root}>
      <Typography variant='h2' color='primary'>Service Categories</Typography>
      <div className={classes.iconedItemsContainer}>
        {!!availableServices.length &&
          availableServices.map((service, i) => (
            <IconedItem {...service} key={service.className + i} />
          ))}
      </div>
    </div>
  );
}

export default ServiceCategories;
