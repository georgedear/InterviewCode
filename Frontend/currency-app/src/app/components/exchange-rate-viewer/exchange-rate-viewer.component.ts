import { Component, effect, input, model, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeRateConverterFormService, ExchangeRateForm, ExchangeRateFormValue } from './exchange-rate-form';
import { Observable, pairwise, startWith, Subject, takeUntil, tap } from 'rxjs';
import { roundNumber } from '../../shared/number-utils';
import { ExchangeRate } from '../../models/exchange-rate';

@Component({
    selector: 'exchange-rate-viewer',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule
    ],
    providers: [ExchangeRateConverterFormService],
    template: `
        @let codes = currencyCodes();

        <div class='input-container' [formGroup]="form">
            <div class='row'>
                <mat-form-field>
                    <mat-label>From Currency</mat-label>
                    <mat-select formControlName="fromCurrency">
                        @for (code of codes; track code) {
                            <mat-option [value]="code">{{ code }}</mat-option>
                        }
                    </mat-select>
                    @if (formService.fromCurrency(form).hasError('required')) {
                        <mat-error><b>From currency</b> is required.</mat-error>
                    }
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Value</mat-label>
                    <input matInput type="number" formControlName="fromValue">
                    @if (formService.fromValue(form).hasError('required')) {
                        <mat-error><b>From value</b> is required.</mat-error>
                    }
                </mat-form-field>
            </div>

            <div class='row'>
                <mat-form-field>
                    <mat-label>To Currency</mat-label>
                    <mat-select formControlName="toCurrency">
                        @for (code of codes; track code) {
                            <mat-option [value]="code">{{ code }}</mat-option>
                        }
                    </mat-select>
                    @if (formService.toCurrency(form).hasError('required')) {
                        <mat-error><b>To currency</b> is required.</mat-error>
                    }
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Value</mat-label>
                    <input matInput type="number" formControlName="toValue" readonly>
                </mat-form-field>
            </div>
        </div>

        <button matIconButton (click)="onSwapButtonClick()">
            <mat-icon>swap_vert</mat-icon>
        </button>
    `,
    styleUrl: "./exchange-rate-viewer.css"
})
export class ExchangeRateViewer implements OnInit, OnDestroy {

    public form: ExchangeRateForm;

    public currencyCodes = input<string[]>();
    public exchangeRate = model<ExchangeRate | null>();

    private _destroying$ = new Subject<void>();
    private _formValues$: Observable<any>;

    constructor(public formService: ExchangeRateConverterFormService) {
        this.form = this.formService.buildForm();

        effect(() => {
            const exchange = this.exchangeRate();
            if (!exchange) {
                return;
            }

            this.updateValuesOnNewExchangeRate(exchange)
        })

        this._formValues$ = this.form.valueChanges
            .pipe(
                takeUntil(this._destroying$),
                startWith(this.form.value),
                pairwise(),
                tap(([previous, current]) => this.handleFormOnChangeEvent(previous, current)))
    }

    public ngOnInit(): void {
        this._formValues$.subscribe();
    }

    public ngOnDestroy(): void {
        this._destroying$.next();
        this._destroying$.complete();
    }

    public onSwapButtonClick(): void {
        const { fromCurrency, toCurrency, fromValue, toValue } = this.form.value;
        this.form.setValue({
            fromCurrency: toCurrency,
            toCurrency: fromCurrency,
            fromValue: toValue,
            toValue: fromValue
        }, { emitEvent: false });
    }

    private handleFormOnChangeEvent(previousValue: ExchangeRateFormValue, newValue: ExchangeRateFormValue): void {
        if (!newValue.fromCurrency || !newValue.toCurrency) {
            return;
        }

        if (newValue.fromCurrency !== previousValue.fromCurrency || newValue.toCurrency !== previousValue.toCurrency) {
            this.exchangeRate.set({ from: newValue.fromCurrency, to: newValue.toCurrency, rate: 1 })
            return;
        }

        const exchange = this.exchangeRate();
        if (!!exchange && newValue.fromValue !== null && newValue.fromValue !== previousValue.fromValue) {
            this.form.patchValue({
                toValue: !!newValue.fromValue ? roundNumber(newValue.fromValue * exchange.rate, 2) : 0
            }, { emitEvent: false });
            return;
        }
    }

    private updateValuesOnNewExchangeRate(exchangeRate: ExchangeRate): void {
        const formValue = this.form.value;
        this.form.patchValue({
            toValue: !!formValue.fromValue ? roundNumber(formValue.fromValue * exchangeRate.rate, 2) : null
        }, { emitEvent: false });
    }
}