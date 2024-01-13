const mongoose = require('mongoose');
const Task = require('../models/task');
const taskController = {};
const User = require('../models/user');

taskController.createTask = async (req, res, next) => {
    try {
        // if (!req.body) {
        //     const exception = new Error("Request body is missing");
        //     throw exception;
        // }

        const {name, status, assignedTo} = req.body;

        // Check if name exists and is a valid string
        // if (!name || typeof name !== 'string') {
        //     const exception = new Error("Invalid or missing name");
        //     throw exception;
        // }

        // Check if status exists and is a valid string
        // if (!status || typeof status !== 'string') {
        //     const exception = new Error("Invalid or missing status");
        //     throw exception;
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
            const exception = new Error('Invalid id');
            throw exception;
        }
        const task = await Task.findById(id, {isDeleted: false});
        if(!task) {
            const exception = new Error('Task not found');
            throw exception;
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
            const exception = new Error('This is for all tasks');
            throw exception;
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
            const exception = new Error('Invalid id');
            throw exception;
        }
        const task = await Task.findById(id, {isDeleted: false});
        if(!task) {
            const exception = new Error('Task not found');
            throw exception;
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
            const exception = new Error('Invalid id');
            throw exception;
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
            const exception = new Error('Invalid id');
            throw exception;
        }
        const task = Task.findById(id, {isDeleted: false});
        const {name, status} = req.body;
        if (!name && !status) {
            const exception = new Error("Missing required information");
            throw exception;
        }
        if (task.status === "done") {
            if (status !== "archive" || status !== "done") {
                const exception = new Error("Cannot change status of done task except to archive");
                throw exception;
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