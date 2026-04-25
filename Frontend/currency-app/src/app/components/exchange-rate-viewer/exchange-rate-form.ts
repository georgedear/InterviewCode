import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface ExchangeRateFormValue {
    fromCurrency?: string | null,
    toCurrency?: string | null,
    fromValue?: number | null,
    toValue?: number | null,
}

export type ExchangeRateForm = FormGroup<{
    [K in keyof ExchangeRateFormValue]: FormControl<ExchangeRateFormValue[K]>
}>;

@Injectable()
export class ExchangeRateConverterFormService {

    constructor(private builder: FormBuilder) { }

    public buildForm(): ExchangeRateForm {
        return this.builder.group({
            fromCurrency: this.builder.control<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
            toCurrency: this.builder.control<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
            fromValue: this.builder.control<number | null>(null, [Validators.required]),
            toValue: this.builder.control<number | null>(null),
        }) as ExchangeRateForm;
    }

    public fromCurrency(form: ExchangeRateForm) {
        return form.get('fromCurrency')!;
    }

    public toCurrency(form: ExchangeRateForm) {
        return form.get('toCurrency')!;
    }

    public fromValue(form: ExchangeRateForm) {
        return form.get('fromValue')!;
    }

    public toValue(form: ExchangeRateForm) {
        return form.get('toValue')!;
    }
}