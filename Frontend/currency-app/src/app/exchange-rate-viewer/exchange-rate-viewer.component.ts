import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'exchange-rate-viewer',
    imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
],
    template: `
        @let codes = currencyCodes();

        <mat-form-field>
            <mat-label>Favorite food</mat-label>
            <mat-select>
                @for (code of codes; track code) {
                <mat-option [value]="code">{{ code }}</mat-option>
                }
            </mat-select>
        </mat-form-field>
    `
})
export class ExchangeRateViewer {

    currencyCodes = input<string[]>();
}