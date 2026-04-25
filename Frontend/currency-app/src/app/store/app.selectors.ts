import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./app.state";

const appState = createFeatureSelector<AppState>('App');

export const getCurrencyCodes = createSelector(appState, state => state.currencyCodes);

export const getExchangeRate = createSelector(appState, appState => appState.exchangeRate);