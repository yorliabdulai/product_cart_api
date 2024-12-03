const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    image: Joi.object({
      thumbnail: Joi.string().uri(),
      mobile: Joi.string().uri(),
      tablet: Joi.string().uri(),
      desktop: Joi.string().uri()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateProduct };