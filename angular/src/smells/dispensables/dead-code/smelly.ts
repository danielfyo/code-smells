import { Component, Input } from '@angular/core';

export interface Ingredient {
  name: string;
  grams: number;
}

// SMELL: Dead Code. An unused field, a parameter nobody passes, a branch that can never run and
// a "legacy" method nobody calls. Readers must work out that none of it matters.
@Component({
  selector: 'cs-dead-code-smelly',
  template: `
    @for (ingredient of scaled(); track ingredient.name) {
      <p>{{ ingredient.name }}: {{ ingredient.grams }} g</p>
    }
  `,
})
export class RecipeScalerSmelly {
  @Input() ingredients: Ingredient[] = [];
  @Input() baseServings = 4;
  @Input() servings = 4;

  // SMELL: written once for a feature that was dropped; never read.
  private readonly maxServings = 50;

  scaled(unit: 'g' | 'oz' = 'g'): Ingredient[] {
    const factor = this.servings / this.baseServings;
    // SMELL: `unit` is never passed, so this branch is unreachable in practice.
    if (unit === 'oz') {
      return this.ingredients.map((i) => ({ name: i.name, grams: Math.round(i.grams * factor * 0.035) }));
    }
    // SMELL: a condition that can never be true.
    if (this.servings < 0 && this.servings > 100) {
      return [];
    }
    return this.ingredients.map((i) => ({ name: i.name, grams: Math.round(i.grams * factor) }));
  }

  // SMELL: superseded by scaled(); kept "just in case".
  legacyScale(grams: number): number {
    return grams * 2;
  }
}
