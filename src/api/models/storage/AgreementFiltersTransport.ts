import { AgreementFilters } from 'api/rif-marketplace-cache/storage/interfaces'

export default class AgreementFiltersTransport {
  offerId?: string

  consumer?: string

  constructor({
    consumer,
    provider,
  }: AgreementFilters) {
    this.offerId = provider
    this.consumer = consumer
  }
}
