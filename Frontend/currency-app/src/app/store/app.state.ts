import { ExchangeRate } from "../models/exchange-rate"


export interface AppState {
    currencyCodes: string[],
    exchangeRate: ExchangeRate | null
}

export const appInitialState: AppState = {
    currencyCodes: [],
    exchangeRate: null
}