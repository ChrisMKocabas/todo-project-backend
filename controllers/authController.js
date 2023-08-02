const db = require("../auth-utils/db-controller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  //authenticate user
  var foundUser = await db.checkUserExist(req.body.email);

  if (!foundUser) {
    return res.status(400).send("Cannot find a matching user!");
  }

  //evaluate password
  if (await bcrypt.compare(password, foundUser.password)) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        user_id: foundUser.user_id,
        email: foundUser.email,
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        user_id: foundUser.user_id,
        email: foundUser.email,
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log({ accessToken });
    res.json({ accessToken });
  } else {
    res.status(400).send("Wrong password entered!");
  }
};

module.exports = { handleLogin };
