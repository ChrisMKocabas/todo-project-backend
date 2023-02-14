const { Joi } = require("celebrate");

//joi signup schema
const reviewSchema = Joi.object({
  review_id: Joi.string(),
  title: Joi.string().min(5).max(30).required(),
  content: Joi.string().min(5).max(200).required(),
});

const validator = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false }); // evaluate all fields
};

exports.validateReview = validator(reviewSchema);
