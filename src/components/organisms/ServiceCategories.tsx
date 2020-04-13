import React from 'react';
import IconedItem, { IconedItemProps } from 'components/molecules/IconedItem';
import { Icons } from 'components/atoms/Icon';
import Heading from 'components/atoms/Heading';
import { ROUTES } from 'routes';

function ServiceCategories() {
  const availableServices: IconedItemProps[] = [
    {
      className: 'nameService',
      to: ROUTES.DOMAINS,
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
    <div
      style={{
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
      }}
    >
      <Heading hLevel={2}>Service Categories</Heading>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          margin: '1em',
        }}
      >
        {!!availableServices.length &&
          availableServices.map((service, i) => (
            <IconedItem {...service} key={service.className + i} />
          ))}
      </div>
    </div>
  );
}

export default ServiceCategories;
