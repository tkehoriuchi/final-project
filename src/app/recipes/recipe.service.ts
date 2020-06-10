import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Fried Rice', 
    //         'Classic, Japanese fried rice.', 
    //         'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fassets.marthastewart.com%2Fstyles%2Fwmax-750%2Fd32%2Fjapanese-fried-rice-0050-d112283%2Fjapanese-fried-rice-0050-d112283_horiz.jpg%3Fitok%3D4vQnlmSf',
    //         [
    //             new Ingredient('Rice', 1),
    //             new Ingredient('Egg', 2),
    //             new Ingredient('Soy Sauce', 1),
    //             new Ingredient('Ham', 4),
    //             new Ingredient('Dashi Stock', 1)
    //         ]
    //     ),
    //     new Recipe(
    //         'Pepperoni \'za', 
    //         'Just your classic pepperoni pizza.', 
    //         'https://www.biggerbolderbaking.com/wp-content/uploads/2019/07/15-Minute-Pizza-WS-Thumbnail.png',
    //         [
    //             new Ingredient('Pizza Dough', 1),
    //             new Ingredient('Mozzerella Cheese', 4),
    //             new Ingredient('Pizza Sauce', 1),
    //             new Ingredient('Pepperoni', 24)
    //         ]
    //     )
    // ];
    private recipes: Recipe[] = [];

    constructor(private shoppingListService: ShoppingListService) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();    // returns copy of recipes array
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}