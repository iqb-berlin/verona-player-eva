import { enableProdMode, StaticProvider } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  {
    provide: 'IS_PRODUCTION_MODE',
    useValue: environment.production
  }
] as StaticProvider[]).bootstrapModule(AppModule)
  .catch(err => console.error(err));
