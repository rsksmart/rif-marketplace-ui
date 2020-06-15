import { Application, Service } from '@feathersjs/feathers';
import { APIController, ServiceEventListener } from 'store/App/AppStore';

type Modify<T, R> = Omit<T, keyof R> & R;

export interface ConfirmationAPI extends APIController {
    ownerAddress: string;
}

export class ConfirmationsController implements ConfirmationAPI {
    path = "/confirmations"
    service!: Service<any>
    private _ownerAddress!: string
    // events = new Set<string>()

    set ownerAddress(address: string) {
        this._ownerAddress = address
    }

    connect = (client: Application<any>) => {
        try {
            this.service = client.service(this.path)
            return this.path
        } catch (e) {
        }
    }

    fetch = (query?: any): Promise<any> => {
        if (!this.service) throw Error('Not connected to a service')
        if (!this.ownerAddress) throw Error('This service requires an ownerAddress. Use the ownerAddress setter upon wallet connection.')

        const { ownerAddress } = this

        return this.service.find({ query: { ownerAddress, ...query } })
    }

    attachEvent = (name: string, callback: ServiceEventListener) => {
        this.service?.on(name, callback)
        // this.events.add(name)
    }
    detachEvent = (name: string) => { }
}