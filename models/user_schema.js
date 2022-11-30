const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = Schema(
  {
    name: { type: String, required: [true, "name field is required"] },
    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "password field is required"] },
    account: {
      type: String,
      required: [true, "account field is required"],
      enum: ['basic', 'premium', 'admin']
    },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Tab" }],
    image_path: {
      type: String
  },
  },
  {
    timestamps: true,

  }
);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password, function (result) {
    return result;
  });
};


module.exports = model("User", userSchema);
