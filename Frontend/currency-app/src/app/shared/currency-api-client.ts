import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable()
export class CurrencyClient {

    public getCurrencyCodes(): Observable<string[]> {
        // TODO: Replace with api call
        return of(['USD', 'GBP', 'EUR']);
    }

    public getExchangeRate(fromCurrency: string, toCurrency: string): Observable<void> {
        // TODO: Replace with api call
        return of();
    }
}