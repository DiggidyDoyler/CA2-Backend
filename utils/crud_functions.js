const User = require("../models/user_schema");
const readAll = (type, req, res, message, populate, populateType) => {
  if (populate === "populate") {
    type
      .find()
      .populate(`${populateType}`)
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          type === User ? data.forEach((data) => (data.password = "")) : "";
          res.status(200).json(data);
        } else {
          res.status(404).json(`${message}`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    type
      .find()
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          res.status(200).json(data);
        } else {
          res.status(404).json(`${message}`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
};

const readOne = (type, id, req, res, populate, populateType) => {
  if (populate === "populate") {
    type
      .findById(id)
      .populate(`${populateType}`)
      .then((data) => {
        if (data) {
          let img;
          type === User ? (data.password = "") : "";
          data.image_path
            ? (img = `${process.env.STATIC_FILES_URL}${data.image_path}`)
            : console.log("No image");
          data.image_path = img;
          res.status(200).json(data);
        } else {
          res.status(404).json({
            message: `${type} with id: ${id} not found`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "CastError") {
          res.status(400).json({
            message: `Bad request, ${type} with id: ${id} is not a valid id`,
          });
        } else {
          res.status(500).json(err);
        }
      });
  } else {
    type
      .findById(id)
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({
            message: `${type} with id: ${id} not found`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "CastError") {
          res.status(400).json({
            message: `Bad request, ${type} with id: ${id} is not a valid id`,
          });
        } else {
          res.status(500).json(err);
        }
      });
  }
};

const create = (type, typeData, typeString, req, res) => {
  type
    .create(typeData)
    .then((data) => {
      console.log(`New ${typeString} created`, data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error("Validation Error!", err);
        res.status(422).json({
          msg: "Validation eror",
          error: err.message,
        });
      } else {
        console.log;
      }
      console.error(err);
      res.status(500).json(err);
    });
};

const update = (type, id, typeString, body, req, res) => {
  type
    .findByIdAndUpdate(id, body, {
      new: true,
    })
    .then((data) => {
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(404).json({
          message: `${typeString} with id: ${id} not found`,
        });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error("Validation Error!", err);
        res.status(422).json({
          msg: "Validation eror",
          error: err.message,
        });
      } else if (err.name === "CastError") {
        res.status(400).json({
          message: `Bad request, ${typeString} with id: ${id} is not a valid id`,
        });
      } else {
        console.log;
      }
      console.error(err);
      res.status(500).json(err);
    });
};

const deleteFunc = (type, id, typeString, req, res) => {
  type
    .deleteOne({ _id: id })
    .then((data) => {
      if (data.deletedCount) {
        res.status(200).json({
          message: `${typeString} with id: ${id} deleted successfully`,
        });
      } else {
        res.status(404).json({
          message: `${typeString} with id: ${id} not found`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(400).json({
          message: `Bad request, ${typeString} with id: ${id} is not a valid id`,
        });
      } else {
        res.status(500).json(err);
      }
    });
};

module.exports = {
  readAll,
  readOne,
  create,
  update,
  deleteFunc,
};
