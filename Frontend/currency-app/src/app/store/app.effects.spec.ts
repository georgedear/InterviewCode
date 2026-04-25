import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CurrencyClient } from '../shared/currency-api-client';
import * as AppActions from './app.actions';
import { Effects } from './app.effects';
import { ExchangeRate } from '../models/exchange-rate';

describe('App Effects', () => {
    let effects: Effects;
    let actions$: Observable<unknown>;
    let currencyClient: jasmine.SpyObj<CurrencyClient>;

    beforeEach(() => {
        const mockCurrencyClient = jasmine.createSpyObj(
            'CurrencyClient', ['getCurrencyCodes', 'getExchangeRate']);

        TestBed.configureTestingModule({
            providers: [
                Effects,
                provideMockActions(() => actions$),
                { provide: CurrencyClient, useValue: mockCurrencyClient }
            ]
        });

        effects = TestBed.inject(Effects);
        currencyClient = TestBed.inject(CurrencyClient) as jasmine.SpyObj<CurrencyClient>;
    });

    describe('loadCurrencyCodes$', () => {
        it('should dispatch loadCurrencyCodesSuccess with currency codes on success', () => {
            // Arrange
            const currencyCodes = ['USD', 'EUR', 'GBP'];

            const serviceResponse = cold('-b|', { b: currencyCodes });
            currencyClient.getCurrencyCodes.and.returnValue(serviceResponse);

            const expected = cold('--c', { c: AppActions.loadCurrencyCodesSuccess({ currencyCodes }) });

            // Act
            actions$ = hot('-a', { a: AppActions.loadCurrencyCodes() });

            expect(effects.loadCurrencyCodes$).toBeObservable(expected);
        });

        it('should dispatch loadCurrencyCodesFailed on error', () => {
            // Arrange
            const error = new Error('Failed to fetch currency codes');

            const serviceResponse = cold('-#', {}, error);
            currencyClient.getCurrencyCodes.and.returnValue(serviceResponse);

            const expected = cold('--(c|)', { c: AppActions.loadCurrencyCodesFailed({ error }) });

            // Act
            actions$ = hot('-a', { a: AppActions.loadCurrencyCodes() });

            // Assert
            expect(effects.loadCurrencyCodes$).toBeObservable(expected);
        });

        it('should use switchMap and cancel in-flight request when a new action arrives', () => {
            // Arrange
            const currencyCodes = ['USD', 'EUR'];

            const serviceResponse = cold('--c|', { c: currencyCodes });
            currencyClient.getCurrencyCodes.and.returnValue(serviceResponse);

            // First response is cancelled, only the second resolves
            const expected = cold('-----c', { c: AppActions.loadCurrencyCodesSuccess({ currencyCodes }) });

            // Act
            // Second action arrives (b) before first response completes, cancelling the first
            actions$ = hot('-a-b', {
                a: AppActions.loadCurrencyCodes(),
                b: AppActions.loadCurrencyCodes()
            });

            // Arrange
            expect(effects.loadCurrencyCodes$).toBeObservable(expected);
        });

        it('should handle multiple sequential successful actions', () => {
            // Arrange
            const firstCurrencyCodes = ['USD', 'EUR'];
            const secondCurrencyCodes = ['GBP', 'JPY'];


            currencyClient.getCurrencyCodes.and.returnValues(
                cold('-c|', { c: firstCurrencyCodes }),
                cold('-d|', { d: secondCurrencyCodes })
            );

            const expected = cold('--c--d', {
                c: AppActions.loadCurrencyCodesSuccess({ currencyCodes: firstCurrencyCodes }),
                d: AppActions.loadCurrencyCodesSuccess({ currencyCodes: secondCurrencyCodes })
            });

            // Act
            actions$ = hot('-a--b', {
                a: AppActions.loadCurrencyCodes(),
                b: AppActions.loadCurrencyCodes()
            });

            // Arrange
            expect(effects.loadCurrencyCodes$).toBeObservable(expected);
        });
    });

    describe('loadExchangeRate$', () => {
        const exchangeRate: ExchangeRate = {
            from: 'USD',
            to: 'EUR',
            rate: 0.93
        };

        it('should dispatch loadExchangeRateSuccess with exchange rate on success', () => {
            // Arrange
            const serviceResponse = cold('-b|', { b: exchangeRate });
            currencyClient.getExchangeRate.and.returnValue(serviceResponse);

            const expected = cold('--c', { c: AppActions.loadExchangeRateSuccess({ exchangeRate }) });

            // Act
            actions$ = hot('-a', { a: AppActions.loadExchangeRate({ fromCurrency: exchangeRate.from, toCurrency: exchangeRate.to }) });

            // Assert
            expect(effects.loadExchangeRate$).toBeObservable(expected);
        });

        it('should call getExchangeRate with the correct fromCurrency and toCurrency', () => {
            // Arrange
            const serviceResponse = cold('-b|', { b: exchangeRate });
            currencyClient.getExchangeRate.and.returnValue(serviceResponse);

            // Act
            actions$ = hot('-a', { a: AppActions.loadExchangeRate({ fromCurrency: exchangeRate.from, toCurrency: exchangeRate.to }) });

            // Assert
            expect(effects.loadExchangeRate$).toBeObservable(cold('--c', {
                c: AppActions.loadExchangeRateSuccess({ exchangeRate })
            }));

            expect(currencyClient.getExchangeRate).toHaveBeenCalledWith(exchangeRate.from, exchangeRate.to);
        });
        it('should dispatch loadExchangeRateFailed on error', () => {
            // Arrange
            const error = new Error('Failed to fetch exchange rate');

            const serviceResponse = cold('-#', {}, error);
            currencyClient.getExchangeRate.and.returnValue(serviceResponse);

            const expected = cold('--(c|)', { c: AppActions.loadExchangeRateFailed({ error }) });

            // Act
            actions$ = hot('-a', {
                a: AppActions.loadExchangeRate({ fromCurrency: 'USD', toCurrency: 'EUR' })
            });

            // Assert
            expect(effects.loadExchangeRate$).toBeObservable(expected);
        });

        it('should use switchMap and cancel in-flight request when a new action arrives', () => {
            // Arrange
            const serviceResponse = cold('--c|', { c: exchangeRate });
            currencyClient.getExchangeRate.and.returnValue(serviceResponse);

            // First response is cancelled by the second action
            const expected = cold('-----c', { c: AppActions.loadExchangeRateSuccess({ exchangeRate }) });

            // Act
            actions$ = hot('-a-b', {
                a: AppActions.loadExchangeRate({ fromCurrency: 'USD', toCurrency: 'EUR' }),
                b: AppActions.loadExchangeRate({ fromCurrency: 'USD', toCurrency: 'GBP' })
            });

            // Assert
            expect(effects.loadExchangeRate$).toBeObservable(expected);
        });

        it('should handle an exchange rate of zero', () => {
            // Arrange
            const serviceResponse = cold('-b|', { b: exchangeRate });
            currencyClient.getExchangeRate.and.returnValue(serviceResponse);

            const expected = cold('--c', { c: AppActions.loadExchangeRateSuccess({ exchangeRate }) });

            // Act
            actions$ = hot('-a', {
                a: AppActions.loadExchangeRate({ fromCurrency: 'USD', toCurrency: 'USD' })
            });

            // Assert
            expect(effects.loadExchangeRate$).toBeObservable(expected);
        });
    });
});