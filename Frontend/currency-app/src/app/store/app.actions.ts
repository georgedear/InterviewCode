import { createAction, props } from '@ngrx/store';
import { ExchangeRate } from '../models/exchange-rate';

export const loadCurrencyCodes = createAction('[App] Load currency codes');
export const loadCurrencyCodesSuccess = createAction('[App] Successfully loaded currency codes',
    props<{ currencyCodes: string[] }>());
export const loadCurrencyCodesFailed = createAction('[App] Failed to load currency codes',
    props<{ error: any }>());

export const loadExchangeRate = createAction('[App] Load exchange rate',
    props<{ fromCurrency: string, toCurrency: string }>());
export const loadExchangeRateSuccess = createAction('[App] Successfully loaded exchange rate',
    props<{ exchangeRate: ExchangeRate }>());
export const loadExchangeRateFailed = createAction('[App] Failed to load the exchange rate',
    props<{ error: any }>());