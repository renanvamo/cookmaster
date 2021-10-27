const connection = require('../connection/connection');

const USER_COLLECTION = 'users';
const userConnection = () => connection().then(db => db.collection(USER_COLLECTION));

const getUserByName = (name) => {
  const mongoConnection = await userConnection();

  const user = await mongoConnection.findOne({ name });
  console.log(user);
  return user;
};

const createUser = async ({ name, email, password, role }) => {
  const mongoConnection = await userConnection();

  const alreadyExistUser = await getUserByName(name);
  if (alreadyExistUser) return null;

  const { insertedId: id } = mongoConnection.insertOne({ name, email, password, role });
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