import { Color } from '@material-ui/lab/Alert'
import { APIErrorId } from 'api/models/apiService'
import { MarketErrorId } from 'context/Market/interfaces'
import { ContractErrorId } from 'contracts/interfaces'
import { Modify } from 'utils/typeUtils'
import { NotifierErrorId } from 'api/rif-notifier-service/interfaces'

export type Severity = Color

export interface CustomAction {
    name: string
    action: Function
}

export type ErrorId = APIErrorId | ContractErrorId |
    MarketErrorId | NotifierErrorId
export type MessageId = ErrorId | 'wallet' | 'loading'
export type LoaderId = 'filters' | 'data' | 'contract' | 'other'

export interface Message {
    text: string
    type: Severity
    customAction?: CustomAction
}

export type ErrorMessage = Modify<Message, {
    error: Error
}>

export class UIError implements Pick<Message, 'text' | 'customAction'> {
    error!: Error

    id!: ErrorId

    text!: string

    customAction?: CustomAction;

    constructor({
      error, id, text, customAction,
    }: UIError) {
      this.error = error
      this.id = id
      this.text = text
      this.customAction = customAction
    }
}
