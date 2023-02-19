import express from 'express';
import IngredientsController from '../controllers/bakery/ingredientsController.js';
import RecipesController from '../controllers/bakery/recipesController.js';
import Endpoints from '../models/endpoints.js';
// import validateToken from '../middlewares/tokenController.js';

const router = express.Router();

router
    .get(Endpoints.bakery_ingredients, IngredientsController.findAll)
    .post(Endpoints.bakery_ingredients, IngredientsController.save)
    .delete(Endpoints.bakery_ingredients, IngredientsController.delete)
    .put(Endpoints.bakery_ingredients, IngredientsController.update)
    .get(Endpoints.bakery_recipes, RecipesController.findAll)
    .post(Endpoints.bakery_recipes, RecipesController.post)
    .delete(Endpoints.bakery_recipes, RecipesController.delete)
    .put(Endpoints.bakery_recipes, RecipesController.update)
    .patch(Endpoints.bakery_recipes, RecipesController.updateIngredients)

export default router;