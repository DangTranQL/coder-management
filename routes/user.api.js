const express= require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const {validateSchema} = require('../helpers/validateSchema');
const Joi = require('joi');
router.get("/",userController.getAllUsers)

const getUserByIdSchema = Joi.object({
    id: Joi.number().required(),
});

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    tasks: Joi.array().items(Joi.string())
});

const getUserByNameSchema = Joi.object({
    name: Joi.string().required(),
});

const taskSchema = Joi.object({
    task: Joi.string().required(),
});

router.get("/:id", validateSchema(getUserByIdSchema, "params"), userController.getUserById)

router.get("/search/:name", validateSchema(getUserByNameSchema, "params"), userController.getUserByName)

router.get("/tasks/:id", validateSchema(getUserByIdSchema, "params"), userController.getTasksbyId)

router.post("/", validateSchema(createUserSchema, "body"), userController.createUser)

router.delete("/:id", validateSchema(getUserByIdSchema, "params"), userController.deleteUser)

router.delete("/remove/:id", validateSchema(getUserByIdSchema, "params"), validateSchema(taskSchema, "body"), userController.removeTask)

module.exports = router