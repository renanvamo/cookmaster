const Joi = require('joi'); 

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
};
