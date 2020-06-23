import { RnsAddresses } from "api/rif-marketplace-cache/rns/common";
import { ConfirmationAddress } from "api/rif-marketplace-cache/confirmationsController";


export type ServiceAddresses = 'rates/v0/' | ConfirmationAddress | RnsAddresses | 'storage/v0/offers'
