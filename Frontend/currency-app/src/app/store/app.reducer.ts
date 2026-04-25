import { createReducer, on } from "@ngrx/store";
import { appInitialState, AppState } from "./app.state";
import * as AppActions from "./app.actions";

export const reducer = createReducer(
    appInitialState,

    on(AppActions.loadCurrencyCodes, (state): AppState => ({ ...state, currencyCodes: [] })),
    on(AppActions.loadCurrencyCodesSuccess, (state, { currencyCodes }) => ({ ...state, currencyCodes })),
    on(AppActions.loadCurrencyCodesFailed, (state): AppState => ({ ...state })), // No-Op, can easily be removed

    on(AppActions.loadExchangeRate, (state): AppState => ({ ...state })), // No-Op, can easily be removed
    on(AppActions.loadExchangeRateSuccess, (state, { exchangeRate }): AppState => ({ ...state, exchangeRate })),
    on(AppActions.loadExchangeRateFailed, (state): AppState => ({ ...state })) // No-Op, can easily be removed
)

