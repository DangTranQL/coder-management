const express = require("express")
const router = express.Router()
const taskController = require("../controllers/task.controller")
const {validateSchema} = require("../helpers/validateSchema")
const Joi = require("joi")

const getTaskByIdSchema = Joi.object({
    id: Joi.number().required(),
});

const createTaskSchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().required(),
    assignedTo: Joi.number().optional(),
});

router.get("/",taskController.getAllTasks)

router.get("/:id", validateSchema(getTaskByIdSchema, "params"), taskController.getTaskById)

router.post("/", validateSchema(createTaskSchema, "body"), taskController.createTask)

router.put("/:id", validateSchema(getTaskByIdSchema, "params"), taskController.assignTask)

router.put("/update/:id", validateSchema(getTaskByIdSchema, "params"), taskController.updateTask)

router.delete("/:id", validateSchema(getTaskByIdSchema, "params"), taskController.deleteTask)

module.exports = router