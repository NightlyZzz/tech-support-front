export interface LookupItem {
    id: number
    name: string
}

export interface LookupResponse<TItem extends LookupItem> {
    data: TItem[]
}