import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface ExchangeRate {
    from: string,
    to: string,
    rate: number
}

@Injectable()
export class CurrencyClient {

    constructor(private http: HttpClient) {}

    public getCurrencyCodes(): Observable<string[]> {
        return this.http.get<string[]>('http://localhost:5233/Currency/GetCurrencyCodes');
    }

    public getExchangeRate(fromCurrency: string, toCurrency: string): Observable<ExchangeRate> {
        return this.http.get<ExchangeRate>(`'http://localhost:5233/Currency/GetExchangeRate?from=${fromCurrency}&to=${toCurrency}'`);
    }
}