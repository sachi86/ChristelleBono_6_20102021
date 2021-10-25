//Call the module of jsonwebtoken for token management
const jwt = require('jsonwebtoken');

//Allows authentication verification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//Get the token in the request header
    const decodedToken = jwt.verify(token, 'CREATE_SECRET_TOKEN_KEY');//To décode the token with key
    const userId = decodedToken.userId;//Get the user id in the decode token 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {                             //Check that the user id of the token is the same as that of the request
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')// response error unauthorized 
    });
  }
};