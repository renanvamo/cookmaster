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

module.exports = {
  createRecipe,
  getAllRecipes,
};
