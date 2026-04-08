import {
  ApplicationConfig,
  CUSTOM_ELEMENTS_SCHEMA,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
  Type,
} from '@angular/core';

// Minimal Angular application config. We don't use NgModule's at all -
// the AppComponent is standalone, and CUSTOM_ELEMENTS_SCHEMA is set on
// the component itself, not here.
//
// Suppress unused-import: importProvidersFrom and Type are kept around
// for the common case where users will want to add modules later.
void importProvidersFrom;
void (null as unknown as Type<unknown>);

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 18+ supports zoneless change detection, which avoids
    // having to load zone.js. We keep zone.js as a polyfill in
    // angular.json for compatibility, but enable the new strategy
    // here so that signal-based reactivity is the source of truth.
    provideExperimentalZonelessChangeDetection(),
  ],
};

// Re-export for convenience so AppComponent can read the schema list.
export const CUSTOM_ELEMENT_SCHEMAS = [CUSTOM_ELEMENTS_SCHEMA];
