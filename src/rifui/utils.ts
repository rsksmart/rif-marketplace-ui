export const shortenAddress = (address: string) =>
  `${address.substr(0, 6)}...${address.substr(address.length - 4 - 1, 4)}`;
