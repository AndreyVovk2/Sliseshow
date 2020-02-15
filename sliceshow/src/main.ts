import { enableProdMode } from '@angular/core';
import 'zone.js';
import 'reflect-metadata';
import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { Utility } from './app/shared/services/utility.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}


/*

getTranslationProviders().then(providers => {
  const options = { providers };
 platformBrowserDynamic().bootstrapModule(AppModule, options)
 .catch(err => console.log(err));

});

export function getTranslationProviders(): Promise<Object[]> {
  let locale = 'he-He';
  const noProviders: Object[] = [];
  if (!locale || locale === 'en-Us') {
    return Promise.resolve(noProviders);
  }
  const translationFile = '../locale/messages.$(locale).xlf';
  return getTranslationWithImports(translationFile)
      .then((transitions: string) => [
        { provide: TRANSLATIONS, useValue: transitions},
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
        { provide: LOCALE_ID, useValue: locale}
      ])
      .catch(() => noProviders);
}

function  getTranslationWithImports(file: string) {
  const util = new Utility();
  return util.getFile(file);

}*/


platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));

