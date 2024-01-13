const mongoose = require('mongoose');
const Task = require('../models/task');
const taskController = {};
const User = require('../models/user');
const {AppError} = require('../helpers/utils');

taskController.createTask = async (req, res, next) => {
    try {
        // if (!req.body) {
        //     const error = new Error("Request body is missing");
        //     next(error);
        // }

        const {name, status, assignedTo} = req.body;

        // Check if name exists and is a valid string
        // if (!name || typeof name !== 'string') {
        //     const error = new Error("Invalid or missing name");
        //     next(error);
        // }

        // Check if status exists and is a valid string
        // if (!status || typeof status !== 'string') {
        //     const error = new Error("Invalid or missing status");
        //     next(error);
        // }
        let newTask = await Task.create({name, status, assignedTo});
        if (assignedTo) {
            await User.findByIdAndUpdate(assignedTo, {$push: {tasks: newTask._id}});
        }
        const response = {message: "Create Task Successfully!", task: newTask}
        res.status(200).send({data: response})
    } catch (err) {
        next(err);
    }
}

taskController.deleteTask = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const error = new AppError(400, 'Wrong ID Type', 'Bad Request');
            next(error);
        }
        const task = await Task.findById(id, {isDeleted: false});
        if(!task) {
            const error = new AppError(404, 'Not Found', 'Bad Request');
            next(error);
        }
        if (task.assignedTo){
            await User.findByIdAndUpdate(task.assignedTo, {$pull: {tasks: id}});
        }
        let deletedTask = await Task.findByIdAndUpdate(id, {isDeleted: true});
        const response = {message: "Delete Task Successfully!", task: deletedTask};
        res.status(200).send({data: response})
    } catch(err) {
        next(err);
    }
}

taskController.getAllTasks = async (req, res, next) => {
    try{
        let {page,...filterQuery} = req.query;
        const filterKeys = Object.keys(filterQuery);
        if(filterKeys.length) {
            const error = new AppError(404, 'This is for all task', 'Bad Request');
            next(error);
        }

        let allTasks = await Task.find({"isDeleted": false});
        const totalPages = parseInt(allTasks.length / 10);
        page = parseInt(page) || 1;
        let limit = 10;
        let offset = limit * (page-1);
        allTasks = allTasks.slice(offset, offset + limit)

        const response = {
            message: "Get All Tasks Successfully!",
            page: page,
            total: totalPages,
            tasks: allTasks,
        }

        res.status(200).send({data: response})
    } catch (err) {
        next(err);
    }
}

taskController.getTaskById = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const error = new AppError(400, 'Wrong ID Type', 'Bad Request');
            next(error);
        }
        const task = await Task.findById(id, {isDeleted: false});
        if(!task) {
            const error = new AppError(404, 'Not Found', 'Bad Request');
            next(error);
        }
        const response = {message: "Get Task Successfully!", task: task};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}

taskController.assignTask = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const error = new AppError(400, 'Wrong ID Type', 'Bad Request');
            next(error);
        }
        const task = await Task.findById(id, {isDeleted: false});
        const {assignedTo} = req.body;
        if (task.assignedTo){
            await User.findByIdAndUpdate(task.assignedTo, {$pull: {tasks: id}});
        }
        let assignedTask = await Task.findByIdAndUpdate(id, {assignedTo: assignedTo}); 
        await User.findByIdAndUpdate(assignedTo, {$push: {tasks: id}});
        const response = {message: "Assign Task Successfully!", task: assignedTask};
        res.status(200).send({data: response});
    } catch(err) {
        next(err);
    }
}

taskController.updateTask = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const error = new AppError(400, 'Wrong ID Type', 'Bad Request');
            next(error);
        }
        const task = Task.findById(id, {isDeleted: false});
        const {name, status} = req.body;
        // if (!name && !status) {
        //     const error = new Error("Missing required information");
        //     next(error);
        // }
        if (task.status === "done") {
            if (status !== "archive" || status !== "done") {
                const error = new AppError(401, 'Cannot change status', 'Bad Request');;
                next(error);
            }
        }
        let updatedTask = await Task.findByIdAndUpdate(id, {name, status});
        const response = {message: "Update Task Successfully!", task: updatedTask};
        res.status(200).send({data: response});
    } catch(err) {
        next(err);
    }
}

module.exports = taskController;