const { ObjectId } = require('mongodb');
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

  const recipe = await mongoConnection.findOne(ObjectId(id));
  return recipe;
};

const updateRecipe = async (...params) => {
  const [id, name, ingredients, preparation] = params;
  if (!ObjectId.isValid(id)) return null;
  
  const mongoConnection = await recipesConnection();

  const { userId, imageUrl } = await getRecipeById(id);
  
  await mongoConnection.updateOne(
    { _id: id }, 
    { $set: { name, ingredients, preparation, userId, imageUrl } },
  );

  return { _id: id, name, ingredients, preparation, userId };
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
};
