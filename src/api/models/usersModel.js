const connection = require('../connection/connection');
const { ObjectId } = require('mongodb');

const USER_COLLECTION = 'users';
const userConnection = () => connection().then(db => db.collection(USER_COLLECTION));

const getUserByEmail = async (email) => {
  const mongoConnection = await userConnection();

  const user = await mongoConnection.findOne({ email });
  return user;
};

const createUser = async (name, email, password, role) => {
  const mongoConnection = await userConnection();

  const alreadyExistEmail = await getUserByEmail(email);
  if (alreadyExistEmail) return null;

  const result = await mongoConnection.find().toArray();
  console.log(result);

  const { insertedId: id } = await mongoConnection.insertOne({ name, email, password, role });
  return {
    name,
    email,
    role,
    _id: id,
  }
};

module.exports = {
  createUser,
}