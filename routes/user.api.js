const express= require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")

router.get("/",userController.getAllUsers)

router.get("/:id",userController.getUserById)

router.get("/search/:name",userController.getUserByName)

router.get("/tasks/:id",userController.getTasksbyId)

router.post("/",userController.createUser)

router.delete("/:id",userController.deleteUser)

router.delete("/remove/:id",userController.removeTask)

module.exports = router