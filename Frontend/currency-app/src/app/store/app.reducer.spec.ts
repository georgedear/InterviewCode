import { reducer } from './app.reducer';
import { appInitialState, AppState } from './app.state';
import * as AppActions from './app.actions';
import { ExchangeRate } from '../models/exchange-rate';

describe('App Reducer', () => {

    describe('loadCurrencyCodes', () => {
        it('should reset currencyCodes to an empty array', () => {
            // Arrange
            const initialState: AppState = {
                ...appInitialState,
                currencyCodes: ['USD', 'EUR', 'GBP']
            };

            // Act
            const action = AppActions.loadCurrencyCodes();
            const state = reducer(initialState, action);

            // Assert
            expect(state.currencyCodes).toEqual([]);
        });

        it('should not mutate any other state properties', () => {
            // Act
            const action = AppActions.loadCurrencyCodes();
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.exchangeRate).toEqual(appInitialState.exchangeRate);
        });
    });

    describe('loadCurrencyCodesSuccess', () => {
        it('should populate currencyCodes with the provided values', () => {
            // Arrange
            const currencyCodes = ['USD', 'EUR', 'GBP'];

            // Act
            const action = AppActions.loadCurrencyCodesSuccess({ currencyCodes });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.currencyCodes).toEqual(currencyCodes);
        });

        it('should replace existing currencyCodes with new values', () => {
            // Arrange
            const initialState: AppState = {
                ...appInitialState,
                currencyCodes: ['JPY', 'CHF']
            };
            const currencyCodes = ['USD', 'EUR', 'GBP'];

            // Act
            const action = AppActions.loadCurrencyCodesSuccess({ currencyCodes });
            const state = reducer(initialState, action);

            // Assert
            expect(state.currencyCodes).toEqual(currencyCodes);
        });

        it('should handle an empty currencyCodes array', () => {
            // Act
            const action = AppActions.loadCurrencyCodesSuccess({ currencyCodes: [] });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.currencyCodes).toEqual([]);
        });

        it('should not mutate any other state properties', () => {
            // Arrange
            const currencyCodes = ['USD', 'EUR'];

            // Act
            const action = AppActions.loadCurrencyCodesSuccess({ currencyCodes });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.exchangeRate).toEqual(appInitialState.exchangeRate);
        });
    });

    describe('loadCurrencyCodesFailed', () => {
        const error = new Error('Boom!')

        it('should return the state unchanged (no-op)', () => {
            // Act
            const action = AppActions.loadCurrencyCodesFailed({ error });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state).toEqual(appInitialState);
        });

        it('should preserve existing currencyCodes on failure', () => {
            // Arrange
            const initialState: AppState = {
                ...appInitialState,
                currencyCodes: ['USD', 'EUR']
            };

            // Act
            const action = AppActions.loadCurrencyCodesFailed({ error });
            const state = reducer(initialState, action);

            // Assert
            expect(state.currencyCodes).toEqual(['USD', 'EUR']);
        });
    });

    describe('loadExchangeRate', () => {
        it('should return the state unchanged (no-op)', () => {
            // Act
            const action = AppActions.loadExchangeRate({ fromCurrency: 'USD', toCurrency: 'GBP' });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state).toEqual(appInitialState);
        });
    });

    describe('loadExchangeRateSuccess', () => {
        const exchangeRate: ExchangeRate = {
            from: 'USD',
            to: 'GBP',
            rate: 1.23
        };

        it('should populate exchangeRate with the provided value', () => {
            // Act
            const action = AppActions.loadExchangeRateSuccess({ exchangeRate });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.exchangeRate).toEqual(exchangeRate);
        });

        it('should replace an existing exchangeRate with a new value', () => {
            // Arrange
            const initialState: AppState = {
                ...appInitialState,
                exchangeRate: { ...exchangeRate, rate: 1.99 }
            };

            // Act
            const action = AppActions.loadExchangeRateSuccess({ exchangeRate });
            const state = reducer(initialState, action);

            // Assert
            expect(state.exchangeRate).toEqual(exchangeRate);
        });

        it('should handle an exchangeRate of zero', () => {
            // Act
            const action = AppActions.loadExchangeRateSuccess({ exchangeRate: { ...exchangeRate, rate: 0 } });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.exchangeRate?.rate).toEqual(0);
        });

        it('should not mutate any other state properties', () => {
            // Act
            const action = AppActions.loadExchangeRateSuccess({ exchangeRate });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state.currencyCodes).toEqual(appInitialState.currencyCodes);
        });
    });

    describe('loadExchangeRateFailed', () => {
        const error = new Error('Boom!')
        const exchangeRate: ExchangeRate = {
            from: 'USD',
            to: 'GBP',
            rate: 1.23
        };

        it('should return the state unchanged (no-op)', () => {
            // Act
            const action = AppActions.loadExchangeRateFailed({ error });
            const state = reducer(appInitialState, action);

            // Assert
            expect(state).toEqual(appInitialState);
        });

        it('should preserve existing exchangeRate on failure', () => {
            // Act
            const initialState: AppState = {
                ...appInitialState,
                exchangeRate
            };

            // Act
            const action = AppActions.loadExchangeRateFailed({ error });
            const state = reducer(initialState, action);

            // Assert
            expect(state.exchangeRate).toEqual(exchangeRate);
        });
    });
});