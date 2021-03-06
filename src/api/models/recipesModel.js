const { ObjectId } = require('mongodb');
const connection = require('../connection/connection');

const COLLECTION = 'recipes';
const recipesConnection = () => connection().then((db) => db.collection(COLLECTION));

const createRecipe = async (...params) => {
  const [name, ingredients, preparation, userId, url] = params;
  const mongoConnection = await recipesConnection();

  const { insertedId } = await mongoConnection.insertOne({
    name,
    ingredients,
    preparation,
    userId,
    image: url,
  });

  return { name, ingredients, preparation, userId, _id: insertedId };
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
  const [id, name, ingredients, preparation, userId, image] = params;
  
  const mongoConnection = await recipesConnection();
  
  await mongoConnection.updateOne(
    { _id: id }, 
    { $set: { name, ingredients, preparation, userId, image } },
  );

  return { _id: id, name, ingredients, preparation, userId };
};

const deleteRecipe = async (id) => {  
  const mongoConnection = await recipesConnection();
  
  await mongoConnection.deleteOne({ _id: ObjectId(id) });

  return true;
};

const uploadImage = async (id, pathString) => {
  if (!ObjectId.isValid(id)) return null;
    
  const mongoConnection = await recipesConnection();

  await mongoConnection.updateOne(
    { _id: ObjectId(id) },
    { $set: { image: pathString } },
  );

  const uploadedImage = await getRecipeById(id);
  return uploadedImage;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
