import React from 'react';
import IconedItem, { IconedItemProps } from 'components/molecules/IconedItem';
import { IconsEnum } from 'components/atoms/Icon';
import Heading from 'components/atoms/Heading';

function ServiceCategories() {
  const availableServices: IconedItemProps[] = [
    {
      className: 'nameService',
      text: 'Name Service',
      iconProps: { name: IconsEnum.BLANK },
    },
    {
      className: 'storage',
      text: 'Storage',
      iconProps: { name: IconsEnum.BLANK },
    },
    {
      className: 'payments',
      text: 'Payments',
      iconProps: { name: IconsEnum.BLANK },
    },
    {
      className: 'dataService',
      text: 'Data Services',
      iconProps: { name: IconsEnum.BLANK },
    },
    {
      className: 'communications',
      text: 'Communications',
      iconProps: { name: IconsEnum.BLANK },
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
