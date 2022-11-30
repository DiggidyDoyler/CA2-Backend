const rateLimit = require("express-rate-limit")


const loginRequired = async (req, res, next) => {
  if (req) {

   next();
  }
 
  else {
    res.status(401).json({
      msg: "Unauthorised user",
    });
  }
};

const adminRequired = (req, res, next) => {
  if (req.user.account === "admin") {
    next();
  } else {
    res.status(401).json({
      msg: "Unauthorised user",
    });
  }
};

const userLogin =(req,res,next) => {
  if (req.user.account === "admin") {
    next();
  }
  else if (req.user._id === req.params.id) {
    next();
  } else {
    res.status(401).json({
      msg: "Unauthorised user",
    });
  }
}


module.exports = {
  loginRequired,
  adminRequired,
  userLogin,

};
