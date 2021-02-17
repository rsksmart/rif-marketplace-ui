import { ErrorId } from 'models/UIMessage'
import { Dispatch } from 'react'
import { Modify } from 'utils/typeUtils'
import { ErrorMessagePayload, Action } from './interfaces'

export type ErrorReporterError = Modify<Omit<ErrorMessagePayload, 'type'>, {
  id: ErrorId
}>
export interface ErrorReporter {
  (error: ErrorReporterError): void
}
export interface ErrorReporterFactory {
  (dispatch: Dispatch<Action>): ErrorReporter
}

export const errorReporterFactory: ErrorReporterFactory = (
  dispatch: Dispatch<Action>,
) => (error: ErrorReporterError): void => {
  dispatch({
    type: 'SET_MESSAGE',
    payload: {
      ...error,
      type: 'error',
    } as ErrorMessagePayload,
  })
}
