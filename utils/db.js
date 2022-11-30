const mongoose = require("mongoose");

const connect = async () => {
  let db = null;

  try {
    await mongoose.connect(process.env.DB_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected succesfully to db");
    db = mongoose.connection;
    
  } catch (error) {
    console.log(error);
  } finally {
    if (db != null && db.readyState == 1) {
    }
  }
};

module.exports = connect;
