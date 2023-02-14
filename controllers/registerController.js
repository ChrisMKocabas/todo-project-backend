const db = require("../auth-utils/db-controller");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../auth-utils/validator");
const { v4: uuidv4 } = require("uuid");

const handleNewUser = async (req, res) => {
  const { error, value } = await validateSignup(req.body); // evaluate all fields
  if (error) {
    return res.status(403).send(error.details);
  }

  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  // check for duplicate usernames in the db
  const userExists = await db.checkUserExist(req.body.email);
  if (userExists) return res.status(409).send("User already exists!"); //Conflict

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      user_id: await uuidv4(),
      email: req.body.email,
      password: hashedPassword,
      // fullname: req.body.fullname,
      // address: {
      //   street: req.body.address.street,
      //   city: req.body.address.city,
      //   province: req.body.address.province,
      //   zipcode: req.body.address.zipcode,
      //   country: req.body.address.country,
      // },
      // DOB: req.body.DOB,
    };

    const newUser = await db.addUser(user);
    console.log(newUser);
    res.status(201).json({ success: `New user ${newUser} created!` });
  } catch {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
