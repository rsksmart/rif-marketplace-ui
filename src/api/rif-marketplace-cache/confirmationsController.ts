import { Application, Service } from '@feathersjs/feathers';
import { APIController, ServiceEventListener } from 'store/App/AppStore';

type Modify<T, R> = Omit<T, keyof R> & R;

export interface ConfirmationAPI extends Modify<APIController, {
    connect: (client: Application<any>, ownerAddress?: string) => string | void
}> {
}

export interface ConfirmationsFilter {

}

export interface ConfirmationsItem {
    currentCt: number
    targetCt: number
}

export type Confirmations = Record<string, ConfirmationsItem>

interface ConfirmationsTransportItem {
    transactionHash: string
    confirmations: number
    targetConfirmation: number
    event: string
}

export const mapFromTransport = (data: ConfirmationsTransportItem[]): Confirmations => {
    return data.reduce((map, item: ConfirmationsTransportItem) => {
        map[item.transactionHash] = {
            currentCt: item.confirmations,
            targetCt: item.targetConfirmation
        }
        return map
    }, {})
}

export class ConfirmationsController implements ConfirmationAPI {
    path = "/confirmations"
    service!: Service<any>

    connect = (client: Application<any>, ownerAddress?: string) => {
        try {
            this.service = client.service(this.path)
            return this.path
        } catch (e) {
        }
    }

    fetch = async (query?: ConfirmationsFilter): Promise<Confirmations> => {
        if (!this.service) throw Error('The confirmations service is not connected')

        const data = await this.service.find()

        return mapFromTransport(data)
    }

    attachEvent = (name: string, callback: ServiceEventListener) => {
        this.service?.on(name, callback)
    }
    detachEvent = (name: string) => { }
}