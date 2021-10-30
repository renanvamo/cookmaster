const { ObjectId } = require('express');
const connection = require('../connection/connection');

const COLLECTION = 'recipes';
const recipesConnection = () => connection().then((db) => db.collection(COLLECTION));

const createRecipe = async (...params) => {
  const [name, ingredients, preparation, user, url] = params;
  const mongoConnection = await recipesConnection();

  const { insertedId } = await mongoConnection.insertOne({
    name,
    ingredients,
    preparation,
    userId: user,
    imageUrl: url,
  });

  return { name, ingredients, preparation, userId: user, _id: insertedId };
};

const getAllRecipes = async () => {
  const mongoConnection = await recipesConnection();
  
  const recipes = await mongoConnection.find().toArray();
  return recipes;
};

const getRecipeById = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const mongoConnection = await recipesConnection();

  const recipe = await mongoConnection.find({ id });
  return recipe;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
};
