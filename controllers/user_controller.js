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

  //generate a token
  let token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      _id: user._id,
      account: user.account,
      views: user.view_counter,
      time: user.view_counter_time,
      image: user.image,
      favourites: user.favourites,
    },
    process.env.APP_KEY,
    { expiresIn: "1hr" }
  );

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        msg: err,
      });
    } else {
      user.password = undefined;
      res.status(201).json({
        msg: "User created and logged in",
        token,
        user,
      });
    }
  });
};

const updateUserByID = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  if (body.password) {
    body.password = bcrypt.hashSync(req.body.password, 10);
  }

  User.findByIdAndUpdate(id, body, {
    _id: id,
    new: true,
  })
    .then((data) => {
      console.log(data);
      if (data) {
        data.password = undefined;
        res.status(201).json({
          msg: `Successfully updated`,
          data: data,
        });
        console.log(data, "User Updated!");
      } else {
        res.status(404).json({ message: `User with _id: ${id} not found` });
        console.log("User Not Updated!");
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error("Validation Error!!", err);
        res.status(422).json({
          msg: "Validation Error",
          error: err.message,
        });
      } else if (err.name === "CastError") {
        res.status(400).json({
          message: `Bad request, either ${id} is not a valid _id, or you tried to update your wishlist with an invalid _id`,
          wishlist: body.wishlist,
        });
      } else if (err.codeName === "DuplicateKey") {
        res.status(400).json({
          message: `The email address ${err.keyValue.email} already exists! No duplicate emails allowed.`,
          error: err,
        });
      } else {
        console.error(err);
        res.status(500).json(err);
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
            image: user.image,
            favourites: user.favourites,
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
  // if (req.file) {
  //   req.user.image_path = req.file.filename;
  // }
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
  updateUserByID,
};
