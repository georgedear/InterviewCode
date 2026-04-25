import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from "@ngrx/store";
import { reducer } from "./app/store/app.reducer";
import { provideEffects } from "@ngrx/effects";
import { Effects } from "./app/store/app.effects";
import { CurrencyClient } from "./app/shared/currency-api-client";

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    CurrencyClient,
    provideZoneChangeDetection(),
    provideStore({ App: reducer }),
    provideEffects([Effects]),
    ...appConfig.providers,]
}).catch((err) => console.error(err));
