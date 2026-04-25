import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ExchangeRateViewer } from './components/exchange-rate-viewer/exchange-rate-viewer.component';
import { CurrencyClient, ExchangeRate } from './shared/currency-api-client';
import * as AppActions from './store/app.actions';
import * as AppSelectors from './store/app.selectors';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ExchangeRateViewer],
  providers: [CurrencyClient],
  template: `
    <exchange-rate-viewer 
      [currencyCodes]="currencyCodes()" 
      [exchangeRate2]="exchangeRate()" 
      (exchangeRate2Change)="onExchangeRateSelectionChange($event)" />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  public currencyCodes = signal<string[]>([])
  public exchangeRate = signal<ExchangeRate | null>(null);

  private _currencyCodes$: Observable<string[]>;
  private _exchangeRate$: Observable<ExchangeRate | null>;
  private _destorying$ = new Subject<void>();

  constructor(private _store$: Store) {
    this._currencyCodes$ = this._store$.select(AppSelectors.getCurrencyCodes);
    this._exchangeRate$ = this._store$.select(AppSelectors.getExchangeRate);
  }

  public ngOnInit(): void {
    this._store$.dispatch(AppActions.loadCurrencyCodes());

    this._currencyCodes$
      .pipe(takeUntil(this._destorying$))
      .subscribe(codes => this.currencyCodes.set(codes))

    this._exchangeRate$
      .pipe(takeUntil(this._destorying$))
      .subscribe(rate => this.exchangeRate.set(rate))
  }

  public ngOnDestroy(): void {
    this._destorying$.next();
    this._destorying$.complete();
  }

  public onExchangeRateSelectionChange(rate: ExchangeRate | null | undefined): void {
    if (!rate) {
      return;
    }

    this._store$.dispatch(AppActions.loadExchangeRate({ fromCurrency: rate.from, toCurrency: rate.to }));
  }
}
