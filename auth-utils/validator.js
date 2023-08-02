const { Joi } = require("celebrate");

//joi signup schema
const signupSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  confirmPassword: Joi.ref("password"),
  username: Joi.string().min(3).max(30).required(),
});

const validator = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false }); // evaluate all fields
};

exports.validateSignup = validator(signupSchema);
