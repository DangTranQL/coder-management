const { sendResponse, AppError}=require("../helpers/utils.js")

var express = require('express');
var router = express.Router();

const userAPI = require("./user.api");
const taskAPI = require("./task.api");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to CoderManagement!");
});

/* User */
router.use("/users", userAPI);

/* Task */
router.use("/tasks", taskAPI);

module.exports = router;
