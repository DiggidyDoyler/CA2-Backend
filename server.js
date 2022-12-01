const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
var cors = require('cors')

app.use(cors())

require("dotenv").config();

require("./utils/db.js")();

app.use(express.json());



app.use(express.static("public"));

app.use((req, res, next) => {
  if (req.headers?.authorization?.split(" ")[0] === "Bearer") {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.APP_KEY,
      (err, decoded) => {
        if (err) err.user = undefined;

        req.user = decoded;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});



app.use((req, res, next) => {
  console.log("USER: ");
  console.log(req.user);  
  next();
});

app.use("/api/users", require("./routes/users") );
app.use("/api/tabs", require("./routes/tabs"));
app.use("/api/artists", require("./routes/artists"));

app.listen(port, () => {
  console.log(`Tabs app listening on port ${port}`);
});