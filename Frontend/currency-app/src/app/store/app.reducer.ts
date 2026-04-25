import { createReducer, on } from "@ngrx/store";
import { appInitialState, AppState } from "./app.state";
import * as AppActions from "./app.actions";

export const reducer = createReducer(
    appInitialState,

    on(AppActions.loadCurrencyCodes, (state): AppState => ({ ...state, currencyCodes: [] })),
    on(AppActions.loadCurrencyCodesSuccess, (state, { currencyCodes }) => ({ ...state, currencyCodes })),
    on(AppActions.loadCurrencyCodesFailed, (state): AppState => ({...state}))

    // TODO: Implement exchange rate reducers
)

