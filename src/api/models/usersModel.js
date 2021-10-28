const connection = require('../connection/connection');

const USER_COLLECTION = 'users';
const userConnection = () => connection().then((db) => db.collection(USER_COLLECTION));

const findUserByEmail = async (email) => {
  const mongoConnection = await userConnection();

  const user = await mongoConnection.findOne({ email });

  return user;
};

const createUser = async (name, email, password, role) => {
  const mongoConnection = await userConnection();

  const alreadyExistEmail = await findUserByEmail(email);
  if (alreadyExistEmail) return null;

  await mongoConnection.find().toArray();

  const { insertedId: id } = await mongoConnection.insertOne({ name, email, password, role });
  return {
    name,
    email,
    role,
    _id: id,
  };
};

module.exports = {
  createUser,
  findUserByEmail,
};
