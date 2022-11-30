const Tab = require("../models/tab_schema");
const Artist = require("../models/artist_schema");
const User = require("../models/user_schema");
const {  readAll, update, create, deleteFunc } = require("../utils/crud_functions");
const { faker } = require("@faker-js/faker");
const e = require("express");





const readAllData = (req, res) => {
  readAll(Tab, req, res, "There is currently no tabs in the database")
}

const readData = (req, res) => {
  let id = req.params.id;

  Tab.findById(id)
    .then((data) => {
      if ((data.difficulty === "intermediate") && req.user.account === "basic"){
        res.status(401).json({
          msg: "You must be a premium user to view Intermediate Tabs",
        });
      }
     else if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Tab with id: ${id} not found`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(400).json({
          message: `Bad request, Tab with id: ${id} is not a valid id`,
        });
      } else {
        res.status(500).json(err);
      }
    });
};

const createData =  (req, res) => {
  let tabData = req.body;
  let id = faker.database.mongodbObjectId();
  tabData._id = id;
  tabData.author = req.user.name
  create(Tab, tabData, "Tab", req, res)

  // Check if the artist already exists in the db 
  Artist.find()
  .then((data) => {
    let newArtistData;
    //Loop through artists
    for (let i = 0; i < data.length; i++){
      //If an artist names in the db matches with artist of this song
      if (data[i].artist === tabData.artist){
      //Push current tab into songs array
      newArtistData = data[i];
      newArtistData.songs.push(tabData._id)
     
      if (newArtistData) {
      //Replace Artist in DB with new Artist containing new song
      Artist.findByIdAndUpdate(newArtistData._id, newArtistData, {
        new: true,
      })
        .then((data) => {
          if (data) {
            console.log("Artist Updated Successful")
          } else {
        console.log("Artist Updated Failed")
          }
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            console.error("Validation Error!", err);
          }
     
        });
      
      } else {
        return newArtistData;
      }
    }
    }
      //If the artist doesn't exist, create them
       if(!newArtistData) {
        let artistData = new Artist;
        artistData.artist = tabData.artist
        artistData.songs = [id]
        //Creating the songs Array for the Artist
        Artist.create(artistData)
        .then((data) => {
          console.log(`New Artist created`, data);
  
      })
       .catch((err) => {
      if (err.name === "ValidationError") {
        console.error("Validation Error!", err);
       }})
      }
     
})
  
}

const updateData = (req, res) => {
  let id = req.params.id;
  let body = req.body;
  if (req.user.account === "admin") {
  update(Tab, id, "Tab", body, req, res)
  } else {
    
  User.findById(req.user._id)
  .then((data) => {
    if (data.name === req.user.name){
      update(Tab, id, "Tab", body, req, res)
    }
    else{
      res.status(401).json({
        msg: "You do not have permission to update this tab",
      });
    }
  })
  }
}

const deleteData = (req, res) => {
  let id = req.params.id;

  deleteFunc(Tab, id, "Tab", req, res);

  //Get all Artists
  Artist.find()
  .then((data) => {
    let newArtistData;
    //Loop through artists
    for (let i = 0; i < data.length; i++){
     //If the song is inside the data
      if (data[i].songs.includes(id))  {

        //Take the artists details
        newArtistData = data[i]
        //Remove that song from the songs array
        let index = newArtistData.songs.indexOf(id);
        newArtistData.songs.splice(index, 1)
        console.log(`New artist data: ${newArtistData}`)
       
         //Replace Artist in DB with new Artist removing deleted song
      Artist.findByIdAndUpdate(newArtistData._id, newArtistData, {
        new: true,
      })
        .then((data) => {
          if (data) {
            console.log("Artist Updated Successful")
          } else {
        console.log("Artist Updated Failed")
          }
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            console.error("Validation Error!", err);
          }
     
        });
      }
 
      }


     
      
  
  }
  )
}

    
      

 
      
      
    
 
 


 

module.exports = {
  readData,
  readAllData,
  createData,
  updateData,
  deleteData,
};
