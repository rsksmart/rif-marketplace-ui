import { maplistingToType } from 'api/utils';
import { MarketItemType, MarketListingTypes, MarketFilterIface } from 'models/Market';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import { TxType } from 'store/Market/MarketStore';

const CACHE_BASE_ADDR = process.env.REACT_APP_CACHE_ADDR || 'http://localhost:3030';

const socket = io(CACHE_BASE_ADDR);
const client = feathers();
client.configure(socketio(socket));
// <- extract

const services = {
    [MarketListingTypes.domains]: {
        [TxType.BUY]: client.service(`rns/v0/offers`),
        [TxType.LIST]: client.service(`rns/v0/:ownerAddress/domains`)
    }
}


export const fetchMarketDataFor = async (listingType: MarketListingTypes, txType: TxType, filters?: MarketFilterIface):
    Promise<MarketItemType[]> => {
    const data = await services[listingType][txType].find({
        query: filters
    })
    return maplistingToType(data.data, listingType)
}