const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    res.status(401).send({ message: "Auth failed", success: false });
  }
};
