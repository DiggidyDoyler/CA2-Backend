const express = require("express");
const router = express.Router();
const {
  loginRequired,
  adminRequired,
} = require("../controllers/auth_controller");

const {
  readAllData,
  readData,
  createData,
  updateData,
  deleteData,
} = require("../controllers/artist_controller");

router
  .get("/", readAllData)
  .get("/:id", loginRequired, readData)
  .post("/", loginRequired, createData)
  .put("/:id", adminRequired, updateData)
  .delete("/:id", adminRequired, deleteData);

module.exports = router;
