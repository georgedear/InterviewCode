import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class ExchangeRateConverterFormService {

    constructor(private builder: FormBuilder) { }

    public buildForm(): FormGroup {
        return this.builder.group({
            fromCurrency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            toCurrency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            fromValue: [null],
            toValue: [null]
        });
    }

    public fromCurrency(form: FormGroup) {
        return form.get('fromCurrency')!;
    }

    public toCurrency(form: FormGroup) {
        return form.get('toCurrency')!;
    }

    public fromValue(form: FormGroup) {
        return form.get('fromValue')!;
    }

    public toValue(form: FormGroup) {
        return form.get('toValue')!;
    }
}