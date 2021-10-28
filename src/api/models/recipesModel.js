const connection = require('../connection/connection');
const { findUserByName } = require('./usersModel');

const COLLECTION = 'recipes';
const recipesConnection = () => connection().then((db) => db.collection(COLLECTION));

const createRecipe = async (name, ingredients, preparation, url) => {
  const mongoConnection = await recipesConnection();

  const { _id } = await findUserByName(name);

  const newRecipe = await mongoConnection.insertOne({
    name,
    ingredients,
    preparation,
    userId: _id,
    imageUrl: url,
  });

  const { insertedId: id } = newRecipe;
  console.log(newRecipe);

  return { ...newRecipe, _id: id };
};

module.exports = {
  createRecipe,
};
