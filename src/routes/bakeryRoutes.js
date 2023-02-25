import express from 'express';
import IngredientsController from '../controllers/bakery/ingredientsController.js';
import RecipesController from '../controllers/bakery/recipesController.js';
import ConfigsController from '../controllers/bakery/configsController.js';
import Endpoints from "../models/Endpoints.js"
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
    .get(Endpoints.bakery_configs, ConfigsController.findAll)
    .get(`${Endpoints.bakery_configs}/:storeCode`, ConfigsController.findOne)
    .post(Endpoints.bakery_configs, ConfigsController.post)
    .put(Endpoints.bakery_configs, ConfigsController.update)
    .delete(Endpoints.bakery_configs, ConfigsController.delete)

export default router;