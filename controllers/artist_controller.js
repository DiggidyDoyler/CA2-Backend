const Artist = require("../models/artist_schema");
const { readAll, readOne, update, deleteFunc } = require("../utils/crud_functions");

const readAllData = (req, res) => {
  readAll(Artist, req, res, "There is currently no artists in the database", "populate", "songs");
};

const readData = (req, res) => {
  let id = req.params.id;
  readOne(Artist, id, req, res, "populate", "songs");
};

const createData = (req, res) => {
  let artistData = req.body;

  Artist.create(artistData)
    .then((data) => {
      console.log("New Artist created", data);
      //   data.password = ""
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

const updateData = (req, res) => {
  let id = req.params.id;
  let body = req.body;
  update(Artist, id, "Artist", body, req, res);
  
};

const deleteData = (req, res) => {
  let id = req.params.id;
  Artist.findById(id)
  .then((data) => {
    data.songs === null ? deleteFunc(Artist, id, "Artist", req, res) :  res.status(400).json({message: "Cannot delete an artist that still has songs in the database"});
  })
};

module.exports = {
  readAllData,
  readData,
  createData,
  updateData,
  deleteData,
};
