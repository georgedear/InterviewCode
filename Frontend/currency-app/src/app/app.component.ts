import { Component, signal } from '@angular/core';
import { ExchangeRateViewer } from './exchange-rate-viewer/exchange-rate-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExchangeRateViewer],
  template: `
    <exchange-rate-viewer/>
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
