const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const refreshToken = jwt.sign(
        {
          user_id: decoded.user_id,
          email: decoded.email,
          username: decoded.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      const accessToken = jwt.sign(
        {
          user_id: decoded.user_id,
          email: decoded.email,
          username: decoded.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      await User.updateOne(
        { email: decoded.email },
        { refreshToken: refreshToken }
      ).exec();

      // Delete old refresh token from cookies
      res.clearCookie("jwt");

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
