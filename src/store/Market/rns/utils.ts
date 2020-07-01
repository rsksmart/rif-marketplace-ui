import { Dispatch } from "react"
import { RnsAction } from "./rnsActions"


export const attachApiEventCallback = (dispatch: Dispatch<RnsAction>) => ({ tokenId }) => {
    dispatch({ type: 'OUTDATE', payload: { tokenId } } as any)
}