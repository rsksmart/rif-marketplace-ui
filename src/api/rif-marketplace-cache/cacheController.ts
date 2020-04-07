import { maplistingToType } from 'api/utils';
import { MarketItemType, MarketListingTypes, MarketFilterIface } from 'models/Market';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

// TODO: extract
const CACHE_BASE_ADDR = process.env.REACT_APP_CACHE_ADDR || 'http://localhost:3030';

const socket = io(CACHE_BASE_ADDR);
const client = feathers();
client.configure(socketio(socket));
// <- extract

const services = {
    offers: client.service(`rns/v0/offers`)
}


export const fetchMarketDataFor = async (listingType: MarketListingTypes, filters?: MarketFilterIface):
    Promise<MarketItemType[]> => {
    const data = await services.offers.find({
        query: filters
    })
    return maplistingToType(data.data, listingType);
}