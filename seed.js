const mongoose = require("mongoose");
const User = require("./models/user_schema");
const Tab = require("./models/tab_schema");
const Artist = require("./models/artist_schema");
const {
  generateIds,
  generateFavourites,
  hashPasswords,
  linkArtists,
  linkUsers,
  seedArtists,
  seedTabs,
  seedUsers,
} = require("./databases/dbExports");
require("dotenv").config();

hashPasswords();
generateIds();
generateFavourites();
linkArtists();
linkUsers();

mongoose
  .connect(process.env.DB_ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected succesfully to db");
  })
  .catch((err) => {
    console.log(err);
  });

const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  await Tab.deleteMany({});
  await Tab.insertMany(seedTabs);
  await Artist.deleteMany({});
  await Artist.insertMany(seedArtists);
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Seeding succesful");
});
