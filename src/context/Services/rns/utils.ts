import { Dispatch } from 'react'
import { Action, OutdatePayload } from './interfaces'

const outdateTokenId = (dispatch: Dispatch<Action>) => (
  { tokenId }: OutdatePayload,
): void => {
  dispatch({ type: 'OUTDATE', payload: { tokenId } })
}

export default outdateTokenId
