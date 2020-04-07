import { MarketItemType, MarketListingTypes } from "models/Market";
import { DomainItemIface } from "models/marketItems/DomainItem";

export interface TransferItem {

}

export interface DomainTransferItem extends TransferItem {
    creationDate?: number,
    expirationDate: number,
    newOwnerAddress?: string,
    offerId: string,
    paymentToken: string,
    price: number,
    sellerAddress: string,
    sellerDomain: string,
    soldDate?: number,
    tokenId: string,

}

const mappings = {
    domainListing: (item: DomainTransferItem): DomainItemIface => {
        const {
            offerId,
            sellerAddress,
            sellerDomain,
            expirationDate,
            paymentToken,
            price,
            // creationDate,
            // newOwnerAddress,
            // soldDate,
            // tokenId
        } = item;
        const marketItem: DomainItemIface = {
            price_fiat: 0.5,
            _id: offerId,
            expirationDate,
            paymentToken,
            price,
            sellerAddress,
            sellerDomain,
        }
        return marketItem;
    }
}

export const maplistingToType =
    (data: TransferItem[], listingType: MarketListingTypes):
        MarketItemType[] => data.map(mappings[listingType]);