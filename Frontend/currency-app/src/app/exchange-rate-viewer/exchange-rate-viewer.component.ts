import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'exchange-rate-viewer',
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule
    ],
    template: `
        @let codes = currencyCodes();

        <div class='input-container'>
            <div class='row'>
                <mat-form-field>
                    <mat-label>From Currency</mat-label>
                    <mat-select>
                        @for (code of codes; track code) {
                        <mat-option [value]="code">{{ code }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Value</mat-label>
                    <input matInput type="number">
                </mat-form-field>
            </div>

            <div class='row'>
                <mat-form-field>
                    <mat-label>To Currency</mat-label>
                    <mat-select>
                        @for (code of codes; track code) {
                        <mat-option [value]="code">{{ code }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Value</mat-label>
                    <input matInput type="number">
                </mat-form-field>
            </div>
        </div>

        <button matIconButton>
            <mat-icon>swap_vert</mat-icon>
        </button>
    `,
    styleUrl: "./exchange-rate-viewer.css"
})
export class ExchangeRateViewer {

    currencyCodes = input<string[]>();
}