const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const artistSchema = Schema(
  {
    artist: { type: String, required: [true, "artist field is required"] },
    songs:  [{ type: Schema.Types.ObjectId, ref: "Tab" }],
    genre: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Artist", artistSchema);
