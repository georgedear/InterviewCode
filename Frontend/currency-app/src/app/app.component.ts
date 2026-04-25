import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ExchangeRateViewer } from './components/exchange-rate-viewer/exchange-rate-viewer.component';
import { CurrencyClient } from './shared/currency-api-client';
import * as AppActions from './store/app.actions';
import * as AppSelectors from './store/app.selectors';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ExchangeRateViewer],
  providers: [CurrencyClient],
  template: `
    <exchange-rate-viewer [currencyCodes]="currencyCodes()" />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  // TODO: Query for all currencies on load/construction
  // TODO: Push currency codes into store
  // TODO: Pluck currency codes from store and inject into component

  public currencyCodes = signal<string[]>([])

  private _currencyCodes$: Observable<string[]>;
  private _destorying$ = new Subject<void>();

  constructor(private _store$: Store) {
    this._currencyCodes$ = this._store$.select(AppSelectors.getCurrencyCodes);
  }

  public ngOnInit(): void {
    this._store$.dispatch(AppActions.loadCurrencyCodes());

    this._currencyCodes$
      .pipe(takeUntil(this._destorying$))
      .subscribe(codes => this.currencyCodes.set(codes))
  }

  public ngOnDestroy(): void {
    this._destorying$.next();
    this._destorying$.complete();
  }
}
