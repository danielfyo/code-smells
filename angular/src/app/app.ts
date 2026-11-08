import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Minimal shell so the project builds as an application. The examples live in src/smells and are
 * exercised by their unit tests; each smell folder has a smelly and a refactored version.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Code smells in Angular</h1>
    <p>Every example lives in <code>src/smells/&lt;category&gt;/&lt;slug&gt;</code> with a smelly and a refactored version.</p>
  `,
})
export class App {}
