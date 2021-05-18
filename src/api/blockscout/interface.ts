export type ContractABIEventParam = {
    name: string
    type: string
    indexed?: boolean
}

export type ContractABIItem = {
    name: string
    type: string
    inputs?: Array<ContractABIEventParam>
    constant?: boolean
    outputs?: any
    payable?: boolean
    stateMutability?: string
    anonymous?: boolean
}

export type ContractABIEvent = Pick<ContractABIItem, 'name' | 'inputs' | 'anonymous'>
