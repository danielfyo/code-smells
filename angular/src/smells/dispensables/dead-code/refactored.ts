import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Ingredient {
  name: string;
  grams: number;
}

// REFACTOR: Remove Dead Code. Unused field, parameter, impossible branch and legacy method are
// deleted; version control remembers them if they are ever needed again.
export function scaleIngredients(ingredients: readonly Ingredient[], factor: number): Ingredient[] {
  return ingredients.map(({ name, grams }) => ({ name, grams: Math.round(grams * factor) }));
}

@Component({
  selector: 'cs-dead-code-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (ingredient of scaled(); track ingredient.name) {
      <p>{{ ingredient.name }}: {{ ingredient.grams }} g</p>
    }
  `,
})
export class RecipeScalerRefactored {
  readonly ingredients = input<readonly Ingredient[]>([]);
  readonly baseServings = input(4);
  readonly servings = input(4);

  protected readonly scaled = computed(() =>
    scaleIngredients(this.ingredients(), this.servings() / this.baseServings()),
  );
}
