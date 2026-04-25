import { ExchangeRate } from "../shared/currency-api-client"

export interface AppState {
    currencyCodes: string[],
    exchangeRate: ExchangeRate | null
}

export const appInitialState: AppState = {
    currencyCodes: [],
    exchangeRate: null
}