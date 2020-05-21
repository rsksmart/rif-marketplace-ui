import React, { FC } from 'react';
import { Typography } from '@rsksmart/rif-ui';
import Icon, { Icons } from 'components/atoms/Icon'
import SideImageTemplate from '../../templates/SideImageTemplate';

export interface StoragePageProps { };

const StoragePage: FC<StoragePageProps> = () => {
  const storageIcon = (<Icon src={Icons.STORAGE} />)
  const sideText = (
    <>
      <Typography variant='body1'><b>Decentralized Storage</b> comes with the loss of some control: As pieces of the files are stored on different nodes in the network, it may happen that they get lost.
        This is the reason why <b>Storage Services</b> are so important. They allow for automatic repair of the files in case they are lost, thus enabling full persistence and availability of the stored content, as long as one node (the <i>Provider</i>) stores the file.
      </Typography>
      <br></br>
      <Typography variant='body1'>RIF Marketplace allows <i>Providers</i> of decentralized storage to register their offers, defining a <b>capacity, a storage system (IPFS or Swarm), and a set of subscription/pricing plans</b>. <i>Consumers</i> can browse the available offers and rent the desired space to store the required content, having the option to upload it directly or simply replicate it among different <i>Providers</i>, if required.
      </Typography>
      <br></br>
      <Typography variant='body1'>The service is implemented through a <b>Smart Contract</b> that handles all <b>Storage Offers and Agreements</b> in a transparent and decentralized way. The RIF Storage service is permanently connected to the Blockchain listening to any activity on the Marketplace so it can proceed and persist the required content in an automated manner, providing simplicity and security to all parties.
      </Typography>
    </>
  )

  return (
    <SideImageTemplate mainTitle='Storage' sideIcon={storageIcon} sideText={sideText} />
  );
};

export default StoragePage;
