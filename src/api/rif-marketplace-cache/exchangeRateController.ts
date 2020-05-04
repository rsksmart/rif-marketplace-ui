import { client } from "./cacheController"

const service = client.service('/rates/v0/');

export type SupportedCurrencies = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';
export type SupportedTokens = 'rif';

export const fetchExchangeRatesFor = (tokenName: SupportedTokens, fiatSymbol: SupportedCurrencies) => {
    return service.get(tokenName, {
        query: {
            $select: [fiatSymbol]
        }
    });
}