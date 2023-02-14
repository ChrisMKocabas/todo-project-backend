const { Joi, celebrate } = require("celebrate");
const now = Date.now();
const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18); // go back by 21 years
const ZIPREG = {
  CA: /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] [0-9][ABCEGHJ-NPRSTV-Z][0-9]$/,
};

//joi signup schema
const signupSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  confirmPassword: Joi.ref("password"),
  // fullname: Joi.string().min(3).max(30).required(),
  // address: {
  //   street: Joi.string().max(20).required(),
  //   city: Joi.string().max(20).required(),
  //   province: Joi.string().length(2).required(),
  //   zipcode: Joi.string().regex(ZIPREG.CA).length(7).required(),
  //   country: Joi.string().max(20).required(),
  // },
  // DOB: Joi.date()
  //   .min(1900)
  //   .max(cutoffDate)
  //   .required()
  //   .messages({ "date.max": "Age must be over 18!" }),

  // referred : Joi.boolean().required(), // if referral is true
  // referralDetails: Joi.string().when("referred", { //provide referral details
  //     is:true,
  //     then: Joi.string().required().min(3).max(50),
  //     otherwise:Joi.string().optional()
  // }),
  // hobbies: Joi.array().items(Joi.string(), Joi.number()),
  // acceptTos: Joi.boolean().truthy("Yes").valid(true), //only proceed if TOS accepted
});

const validator = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false }); // evaluate all fields
};

exports.validateSignup = validator(signupSchema);
