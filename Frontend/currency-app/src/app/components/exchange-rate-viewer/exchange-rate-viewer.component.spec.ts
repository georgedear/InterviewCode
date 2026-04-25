import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ExchangeRateViewer } from './exchange-rate-viewer.component';
import { ExchangeRate } from '../../models/exchange-rate';

describe('ExchangeRateViewer', () => {
    let fixture: ComponentFixture<ExchangeRateViewer>;
    let component: ExchangeRateViewer;
    let loader: HarnessLoader;

    const CURRENCY_CODES = ['USD', 'EUR', 'GBP'];

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExchangeRateViewer],
        }).compileComponents();

        fixture = TestBed.createComponent(ExchangeRateViewer);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('currencyCodes', CURRENCY_CODES);
        fixture.componentRef.setInput('exchangeRate', null);
        fixture.detectChanges();

        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    // -------------------------------------------------------------------------
    // Harness helpers
    //
    // Form field order (matching the template top-to-bottom):
    //   [0] From Currency (select)
    //   [1] From Value    (input)
    //   [2] To Currency   (select)
    //   [3] To Value      (input – readonly)
    // -------------------------------------------------------------------------

    async function getAllFormFields(): Promise<MatFormFieldHarness[]> {
        return loader.getAllHarnesses(MatFormFieldHarness);
    }

    async function getFromCurrencySelect(): Promise<MatSelectHarness> {
        const fields = await getAllFormFields();
        return fields[0].getControl(MatSelectHarness) as Promise<MatSelectHarness>;
    }

    async function getToCurrencySelect(): Promise<MatSelectHarness> {
        const fields = await getAllFormFields();
        return fields[2].getControl(MatSelectHarness) as Promise<MatSelectHarness>;
    }

    async function getFromValueInput(): Promise<MatInputHarness> {
        const fields = await getAllFormFields();
        return fields[1].getControl(MatInputHarness) as Promise<MatInputHarness>;
    }

    async function getToValueInput(): Promise<MatInputHarness> {
        const fields = await getAllFormFields();
        return fields[3].getControl(MatInputHarness) as Promise<MatInputHarness>;
    }

    async function getSwapButton(): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness);
    }

    /** Select both currencies and run change detection. */
    async function selectCurrencies(from: string, to: string): Promise<void> {
        await (await getFromCurrencySelect()).clickOptions({ text: from });
        await (await getToCurrencySelect()).clickOptions({ text: to });
        fixture.detectChanges();
    }

    /** Push a new exchange rate into the model input and run change detection. */
    async function setExchangeRate(exchangeRate: ExchangeRate): Promise<void> {
        fixture.componentRef.setInput('exchangeRate', exchangeRate);
        fixture.detectChanges();
    }

    // =========================================================================
    // Rendering
    // =========================================================================

    describe('Rendering', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should render four form fields', async () => {
            const fields = await getAllFormFields();
            expect(fields.length).toBe(4);
        });

        it('should populate the from-currency dropdown with the provided currency codes', async () => {
            const fromSelect = await getFromCurrencySelect();
            await fromSelect.open();

            const options = await fromSelect.getOptions();
            const optionTexts = await Promise.all(options.map(o => o.getText()));

            expect(optionTexts).toEqual(CURRENCY_CODES);
        });

        it('should populate the to-currency dropdown with the provided currency codes', async () => {
            const toSelect = await getToCurrencySelect();
            await toSelect.open();

            const options = await toSelect.getOptions();
            const optionTexts = await Promise.all(options.map(o => o.getText()));

            expect(optionTexts).toEqual(CURRENCY_CODES);
        });

        it('should render the to-value input as readonly', async () => {
            const toValueInput = await getToValueInput();
            expect(await toValueInput.isReadonly()).toBeTrue();
        });

        it('should render a swap button', async () => {
            const swapButton = await getSwapButton();
            expect(swapButton).toBeTruthy();
        });
    });

    // =========================================================================
    // Currency Selection
    // =========================================================================

    describe('Currency Selection', () => {
        it('should emit exchangeRate with rate 1 when both currencies are first selected', async () => {
            await selectCurrencies('USD', 'EUR');

            expect(component.exchangeRate()).toEqual({ from: 'USD', to: 'EUR', rate: 1 });
        });

        it('should update exchangeRate when the from-currency is changed', async () => {
            await selectCurrencies('USD', 'EUR');

            await (await getFromCurrencySelect()).clickOptions({ text: 'GBP' });
            fixture.detectChanges();

            expect(component.exchangeRate()).toEqual({ from: 'GBP', to: 'EUR', rate: 1 });
        });

        it('should update exchangeRate when the to-currency is changed', async () => {
            await selectCurrencies('USD', 'EUR');

            await (await getToCurrencySelect()).clickOptions({ text: 'GBP' });
            fixture.detectChanges();

            expect(component.exchangeRate()).toEqual({ from: 'USD', to: 'GBP', rate: 1 });
        });

        it('should not update exchangeRate when no currency is selected', async () => {
            const fromValueInput = await getFromValueInput();
            await fromValueInput.setValue('100');
            fixture.detectChanges();

            expect(component.exchangeRate()).toBeNull();
        });
    });

    // =========================================================================
    // Value Conversion
    // =========================================================================

    describe('Value Conversion', () => {
        const BASE_RATE: ExchangeRate = { from: 'USD', to: 'EUR', rate: 0.85 };

        beforeEach(async () => {
            await selectCurrencies('USD', 'EUR');
            await setExchangeRate(BASE_RATE);
        });

        it('should convert fromValue to toValue using the current exchange rate', async () => {
            await (await getFromValueInput()).setValue('100');
            fixture.detectChanges();

            expect(await (await getToValueInput()).getValue()).toBe('85');
        });

        it('should round the converted value to 2 decimal places', async () => {
            await setExchangeRate({ from: 'USD', to: 'EUR', rate: 0.123456 });

            await (await getFromValueInput()).setValue('100');
            fixture.detectChanges();

            // 100 × 0.123456 = 12.3456 → rounded to 12.35
            expect(await (await getToValueInput()).getValue()).toBe('12.35');
        });

        it('should set toValue to 0 when fromValue is set to 0', async () => {
            const fromValueInput = await getFromValueInput();
            await fromValueInput.setValue('100');
            fixture.detectChanges();

            // Setting to '0' is the correct way to trigger a zero conversion.
            // Clearing the input (empty string) causes Angular to emit null for
            // a number-type control, which is caught by the null guard in
            // handleFormOnChangeEvent and leaves toValue unchanged.
            await fromValueInput.setValue('0');
            fixture.detectChanges();

            expect(await (await getToValueInput()).getValue()).toBe('0');
        });

        it('should recalculate toValue when a new exchange rate is received', async () => {
            await (await getFromValueInput()).setValue('100');
            fixture.detectChanges();

            await setExchangeRate({ from: 'USD', to: 'EUR', rate: 0.9 });

            // 100 × 0.9 = 90
            expect(await (await getToValueInput()).getValue()).toBe('90');
        });

        it('should immediately recalculate toValue using rate 1 when the to-currency changes', async () => {
            await (await getFromValueInput()).setValue('100');
            fixture.detectChanges();

            await (await getToCurrencySelect()).clickOptions({ text: 'GBP' });
            fixture.detectChanges();

            // Changing either currency calls this.exchangeRate.set({ rate: 1 }),
            // which triggers the effect and recalculates toValue as fromValue * 1
            // before the real rate has been fetched.
            expect(await (await getToValueInput()).getValue()).toBe('100');
        });
    });

    // =========================================================================
    // Swap Button
    // =========================================================================

    describe('Swap Button', () => {
        const BASE_RATE: ExchangeRate = { from: 'USD', to: 'EUR', rate: 0.85 };

        beforeEach(async () => {
            await selectCurrencies('USD', 'EUR');
            await setExchangeRate(BASE_RATE);

            await (await getFromValueInput()).setValue('100');
            fixture.detectChanges();
        });

        it('should swap the from and to currency selections', async () => {
            await (await getSwapButton()).click();
            fixture.detectChanges();

            expect(await (await getFromCurrencySelect()).getValueText()).toBe('EUR');
            expect(await (await getToCurrencySelect()).getValueText()).toBe('USD');
        });

        it('should move the original to-value into the from-value field', async () => {
            const toValueBeforeSwap = await (await getToValueInput()).getValue();

            await (await getSwapButton()).click();
            fixture.detectChanges();

            expect(await (await getFromValueInput()).getValue()).toBe(toValueBeforeSwap);
        });

        it('should move the original from-value into the to-value field', async () => {
            const fromValueBeforeSwap = await (await getFromValueInput()).getValue();

            await (await getSwapButton()).click();
            fixture.detectChanges();

            expect(await (await getToValueInput()).getValue()).toBe(fromValueBeforeSwap);
        });
    });

    // =========================================================================
    // Form Validation
    // =========================================================================

    describe('Form Validation', () => {
        it('should not show errors before any field is interacted with', async () => {
            const fields = await getAllFormFields();
            const errorStates = await Promise.all(fields.map(f => f.hasErrors()));
            expect(errorStates.every(e => e === false)).toBeTrue();
        });

        it('should show a required error on the from-currency field when touched and empty', async () => {
            component.formService.fromCurrency(component.form).markAsTouched();
            fixture.detectChanges();

            const fields = await getAllFormFields();
            const errors = await fields[0].getErrors();
            const errorTexts = await Promise.all(errors.map(e => e.getText()));

            expect(errorTexts).toContain('From currency is required.');
        });

        it('should show a required error on the to-currency field when touched and empty', async () => {
            component.formService.toCurrency(component.form).markAsTouched();
            fixture.detectChanges();

            const fields = await getAllFormFields();
            const errors = await fields[2].getErrors();
            const errorTexts = await Promise.all(errors.map(e => e.getText()));

            expect(errorTexts).toContain('To currency is required.');
        });

        it('should show a required error on the from-value field when touched and empty', async () => {
            component.formService.fromValue(component.form).markAsTouched();
            fixture.detectChanges();

            const fields = await getAllFormFields();
            const errors = await fields[1].getErrors();
            const errorTexts = await Promise.all(errors.map(e => e.getText()));

            expect(errorTexts).toContain('From value is required.');
        });

        it('should clear the from-currency error once a currency is selected', async () => {
            component.formService.fromCurrency(component.form).markAsTouched();
            fixture.detectChanges();

            await (await getFromCurrencySelect()).clickOptions({ text: 'USD' });
            fixture.detectChanges();

            const fields = await getAllFormFields();
            expect(await fields[0].hasErrors()).toBeFalse();
        });
    });
});