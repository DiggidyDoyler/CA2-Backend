const User = require("../models/user_schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
  readAll,
  readOne,
  update,
  deleteFunc,
} = require("../utils/crud_functions");

const register = (req, res) => {
  let newUser = new User(req.body);
  if (req.file) {
    newUser.image_path = req.file.filename;
  }
  newUser.password = bcrypt.hashSync(req.body.password, 10);

  console.log(newUser);

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        msg: err,
      });
    } else {
      user.password = undefined;
      return res.status(201).json(user);
    }
  });
};

const login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user || !user.comparePassword(req.body.password)) {
        res.status(401).json({
          msg: "Authentication failed. Invalid user or password",
        });
      } else {
        //generate a token
        let token = jwt.sign(
          {
            email: user.email,
            name: user.name,
            _id: user._id,
            account: user.account,
            views: user.view_counter,
            time: user.view_counter_time,
          },
          process.env.APP_KEY,
          { expiresIn: "1hr" }
        );
        res.status(200).json({
          msg: "User signed in",
          token,
        });
      }
    })
    .catch((err) => {
      throw err;
    });
};

const readAllData = (req, res) => {
  readAll(
    User,
    req,
    res,
    "There is currently no users in the database",
    "populate",
    "favourites"
  );
};

const readData = (req, res) => {
  let id = req.params.id;
  readOne(User, id, req, res, "populate", "favourites");
};

const updateData = (req, res) => {
  let id = req.params.id;
  let body = req.body;
  if (req.file) {
    req.user.image_path = req.file.filename;
  }
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  id === req.user._id || req.user.account === "admin"
    ? update(User, id, body, req, res)
    : res
        .status(401)
        .json({ msg: "You do not have the permission to edit this user" });
};

const deleteData = (req, res) => {
  let id = req.params.id;
  id === req.user._id || req.user.account === "admin"
    ? deleteFunc(User, id, "User", req, res) + deleteImage(User.image_path)
    : res
        .status(401)
        .json({ msg: "You do not have the permission to delete this user" });
};

const deleteImage = (filename) => {
  let path = `public${process.env.STATIC_FILES_URL}${filename}`;
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.unlink(path, (err) => {
      if (err) throw err;
      console.log(`${filename} was deleted`);
    });
  });
};
module.exports = {
  register,
  login,
  deleteData,
  readAllData,
  readData,
  updateData,
};
