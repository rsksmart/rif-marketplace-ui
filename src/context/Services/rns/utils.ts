import { Dispatch } from 'react'
import { RnsAction } from './rnsActions'

const outdateTokenId = (dispatch: Dispatch<RnsAction>) => ({ tokenId }) => {
  dispatch({ type: 'OUTDATE', payload: { tokenId } } as any)
}

export default outdateTokenId
