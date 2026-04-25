import { Component, signal } from '@angular/core';
import { ExchangeRateViewer } from './exchange-rate-viewer/exchange-rate-viewer.component';
import { CurrencyClient } from './shared/currency-api-client';

@Component({
  selector: 'app-root',
  imports: [ExchangeRateViewer],
  providers: [CurrencyClient],
  template: `
    <exchange-rate-viewer [currencyCodes]="currencyCodes()" />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {

  // TODO: Query for all currencies on load/construction
  // TODO: Push currency codes into store
  // TODO: Pluck currency codes from store and inject into component

  // TODO: Read this from state once implemented
  public currencyCodes = signal<string[]>(['USD', 'GBP', 'EUR'])
}
