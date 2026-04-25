import { Component, input, OnInit } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeRateConverterFormService } from './exchange-rate-form';

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
                    <input matInput type="number" formControlName="toValue">
                </mat-form-field>
            </div>
        </div>

        <button matIconButton (click)="onSwapButtonClick()">
            <mat-icon>swap_vert</mat-icon>
        </button>
    `,
    styleUrl: "./exchange-rate-viewer.css"
})
export class ExchangeRateViewer implements OnInit {

    public currencyCodes = input<string[]>();
    public form!: FormGroup;

    constructor(public formService: ExchangeRateConverterFormService) { }

    public ngOnInit(): void {
        this.form = this.formService.buildForm();
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
}