# Hard-coded Configuration in Services

> **ID:** CS194 · **Category:** Angular-specific · **Sources:** angular.dev: InjectionToken

## Definition

API base URLs, timeouts, page sizes, feature flags or third-party keys written as literals inside services (or
imported directly from `environment.ts` deep in the code), instead of being provided once through dependency
injection with a typed `InjectionToken`.

## Symptoms

- `'https://api.example.com/v2'` or `'/api/v1'` repeated across several services.
- `if (environment.production)` checks scattered through services and components.
- Feature flags as `const` booleans edited by hand before a release.
- Tests that hit real URLs or need module-level mocking to change a value.
- A different build is needed just to point the app at another backend.

## Common causes

- Quick start: "I'll make it configurable later".
- Not knowing how to provide plain values through DI.
- Importing the environment file anywhere because it is convenient.

## Why it is a problem

- **Shotgun surgery**: changing a URL or flag means hunting literals in many files.
- **Hard to test**: values cannot be replaced per test through `TestBed` providers.
- **Inflexible deployment**: one build cannot be promoted across environments with different settings.
- **Hidden dependencies**: a service's real inputs are invisible in its API.

## How it works under the hood

An `InjectionToken<T>` is a typed DI key for values that are not classes. It is provided in `app.config.ts`
(`{ provide: API_CONFIG, useValue: {...} }` or `useFactory`), and consumers call `inject(API_CONFIG)`. The token can
declare a default with `providedIn: 'root'` and `factory`, and it can be overridden at any level of the injector
hierarchy: a route, a component subtree or a single `TestBed` configuration. Build-time `fileReplacements` swap
`environment.ts` per configuration; reading the environment only at the composition root and feeding it into tokens
keeps the rest of the code independent of how the values are obtained (build time, or fetched at startup with
`provideAppInitializer()`).

## Example (smelly)

```ts
@Injectable({ providedIn: 'root' })
export class InvoiceApi {
  private readonly http = inject(HttpClient);

  list(page: number): Observable<Invoice[]> {
    // SMELL: base URL, page size and flag hard-coded in the service
    const url = `https://billing.example.com/api/v2/invoices?page=${page}&size=25`;
    const useNewPdf = true;
    return this.http.get<Invoice[]>(url).pipe(
      map(list => list.map(i => ({ ...i, pdf: useNewPdf ? `${i.id}.v2.pdf` : `${i.id}.pdf` }))),
    );
  }
}
```

## Solution (refactored)

```ts
export interface BillingConfig { baseUrl: string; pageSize: number; newPdf: boolean; }
export const BILLING_CONFIG = new InjectionToken<BillingConfig>('BILLING_CONFIG'); // REFACTOR

@Injectable({ providedIn: 'root' })
export class InvoiceApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(BILLING_CONFIG);                               // REFACTOR

  list(page: number): Observable<Invoice[]> {
    const { baseUrl, pageSize, newPdf } = this.config;
    const params = new HttpParams().set('page', page).set('size', pageSize);
    return this.http.get<Invoice[]>(`${baseUrl}/invoices`, { params }).pipe(
      map(list => list.map(i => ({ ...i, pdf: newPdf ? `${i.id}.v2.pdf` : `${i.id}.pdf` }))),
    );
  }
}

// app.config.ts
// providers: [{ provide: BILLING_CONFIG, useValue: environment.billing }]
```

## Recommended refactorings

- **Introduce an `InjectionToken`** with a typed configuration interface.
- Read `environment.*` only in `app.config.ts` (the composition root) and provide it through tokens.
- Load runtime configuration at startup when the same build must serve several environments.
- In tests, provide a test value for the token instead of mocking modules.

## When it may be acceptable

- True constants of the domain that never vary by environment (e.g. the number of days in a week).
- Small demos and prototypes.

## Related smells

- [HttpClient in Components](./http-in-components.md)
- [Input Drilling](./input-drilling.md)
- [Configurable Data at Low Levels](../11-general/configurable-data-at-low-levels.md)
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md)
- [Magic Configuration Strings](../15-csharp/magic-config-strings.md)
- [Global Data](../05-couplers/global-data.md)

## Automatic detection

- ESLint `no-restricted-imports` to forbid importing `environments/*` outside the composition root.
- ESLint `no-restricted-syntax` or secret scanners for URL literals in `*.service.ts`.
- Code review: string literals starting with `http` in services.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/hardcoded-config/`](../../../angular/src/smells/angular_specific/hardcoded-config/)

## References

- Angular — `InjectionToken`: https://angular.dev/api/core/InjectionToken
- Angular — *Configuring dependency providers*: https://angular.dev/guide/di/dependency-injection-providers
- Angular — *Hierarchical injectors*: https://angular.dev/guide/di/hierarchical-dependency-injection
- Angular — *Dependency injection*: https://angular.dev/guide/di
