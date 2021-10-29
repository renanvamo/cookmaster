const Joi = require('joi'); 

const recipeValidations = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    preparation: Joi.string().required(),
  })
    .validate(data);
  return schema;
};

const userValidations = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  })
    .validate(data);
  return schema;
};

module.exports = {
  userValidations,
  recipeValidations,
};
