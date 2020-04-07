import { MarketFilterIface } from 'models/Market';


export interface DomainsFilterIface extends MarketFilterIface {
    price: {
        $lte: number,
        $gte: number
    },
    sellerDomain: {
        $like: string
    }
}

export class DomainsFilter implements DomainsFilterIface {
    [filterFieldName: string]: { [filterType: string]: any; };
    price!: {
        $lte: number;
        $gte: number;
    };
    sellerDomain!: {
        $like: string;
    };

}