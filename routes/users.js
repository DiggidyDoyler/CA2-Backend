const express = require("express");
const router = express.Router();
const {
  adminRequired,
  loginRequired,
  userLogin,
} = require("../controllers/auth_controller");
const imageUpload = require("../utils/image_upload");

const {
  register,
  login,
  readAllData,
  readData,
  deleteData,
  updateData,
  updateUserByID,
} = require("../controllers/user_controller");

router
  .post("/login", login)
  .post("/register", imageUpload.single("image"), register)
  .get("/:id", userLogin, readData)
  .get("/", adminRequired, readAllData)
  .put("/:id", userLogin, updateUserByID)
  .delete("/:id", loginRequired, deleteData);

module.exports = router;
