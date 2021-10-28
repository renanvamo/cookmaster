const connection = require('../connection/connection');
const usersModel = require('./usersModel');

const COLLECTION = 'recipes';
const recipesConnection = () => connection().then((db) => db.collection(COLLECTION));

const createRecipe = async (name, ingredients, preparation, url) => {
  const mongoConnection = await recipesConnection();

  const { id } = await usersModel.findUserByName(name);

  const { insertedId } = await mongoConnection.insertOne({
    name,
    ingredients,
    preparation,
    userId: id,
    imageUrl: url,
  });

  return { name, ingredients, preparation, userId: id, _id: insertedId };
};

module.exports = {
  createRecipe,
};
