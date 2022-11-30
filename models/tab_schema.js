const { Schema, model } = require("mongoose");

const tabSchema = Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    artist: { type: String, required: [true, "artist field is required"] },
    song_name: {
      type: String,
      required: [true, "song name field is required"],
    },
    song_rating: { type: String, required: [true, "city field is required"] },
    song_hits: {
      type: Number,
    },
    tab_type: { type: String, required: [true, "tab type is required"] },
    difficulty: { type: String, required: [true, "difficulty is required"] },
    key: { type: String, required: [true, "key is required"] },
    capo: { type: String, required: [true, "page type is required"] },
    tuning: { type: String, required: [true, "page type is required"] },
    author: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tab", tabSchema);
