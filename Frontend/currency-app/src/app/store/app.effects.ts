import { CurrencyClient } from './../shared/currency-api-client';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from "@ngrx/store";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import * as AppActions from './app.actions';

@Injectable()
export class Effects {
    private readonly _actions = inject(Actions);
    private readonly _currencyCient = inject(CurrencyClient);

    loadCurrencyCodes$: Observable<Action> = createEffect(() => {
        return this._actions.pipe(
            ofType(AppActions.loadCurrencyCodes),
            switchMap(() => this._currencyCient.getCurrencyCodes()),
            map(currencyCodes => AppActions.loadCurrencyCodesSuccess({ currencyCodes })),
            catchError(error => of(AppActions.loadCurrencyCodesFailed({ error })))) // No-op, placeholder for handling
    });

    loadExchangeRate$: Observable<Action> = createEffect(() => {
        return this._actions.pipe(
            ofType(AppActions.loadExchangeRate),
            switchMap(({ fromCurrency, toCurrency }) => this._currencyCient.getExchangeRate(fromCurrency, toCurrency)),
            map(exchangeRate => AppActions.loadExchangeRateSuccess({ exchangeRate })),
            catchError(error => of(AppActions.loadExchangeRateFailed({ error })))) // No-op, placeholder for handling
    })
}