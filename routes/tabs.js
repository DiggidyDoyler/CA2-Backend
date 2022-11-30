const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const isPremium = async (account) => {
  console.log(`Account is: ${account}`)
	
 if (account === 'admin') 
 return account = true 

 if (account === 'premium') 
 return account = true 

 if (account === 'basic') 
 return account = false

}

const limiter = rateLimit({
  windowMs: 1000 * 60 * 60,
  max: async (req, res) => {
		if (await isPremium(req.user.account)) return 0
		else return 5
	},
  message: async (req, res) => {
		if (await isPremium(req.user.account))
			return 'Working'
		else return 'You can only make 5 requests every hour.'
	},
})


const {
  loginRequired,
  adminRequired,
} = require("../controllers/auth_controller");

const {
  readData,
  readAllData,
  createData,
  updateData,
  deleteData,
} = require("../controllers/tab_controller");

router
  .get("/", readAllData)
  .get("/:id", limiter,  loginRequired, readData, )
  .post("/", loginRequired, createData)
  .put("/:id", loginRequired, updateData)
  .delete("/:id", adminRequired, deleteData);

  
  

  

module.exports = router;
