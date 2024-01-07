const mongoose = require('mongoose');
const User = require('../models/user');
const Task = require('../models/task');
const userController = {};

userController.createUser = async (req, res, next) => {
    try {
        if (!req.body) {
            const exception = new Error("Request body is missing");
            throw exception;
        }

        const {name, role, tasks} = req.body;

        // Check if name exists and is a valid string
        if (!name || typeof name !== 'string') {
            const exception = new Error("Invalid or missing name");
            throw exception;
        }

        // Check if role exists
        if (!role) {
            const exception = new Error("Missing required information");
            throw exception;
        }
        let newUser = await User.create({name, role, tasks});
        const response = {message: "Create User Successfully!", user: newUser}
        res.status(200).send({data: response})
    } catch (err) {
        next(err);
    }
}

userController.getAllUsers = async (req, res, next) => {
    try {
        let {page,...filterQuery} = req.query;
        const filterKeys = Object.keys(filterQuery);
        if(filterKeys.length) {
            const exception = new Error('This is for all users');
            throw exception;
        }

        let allUsers = await User.find({"isDeleted": false});
        const totalPages = parseInt(allUsers.length / 10);
        page = parseInt(page) || 1;
        let limit = 10;
        let offset = limit * (page-1);
        allUsers = allUsers.slice(offset, offset + limit)

        const response = {
            message: "Get All Users Successfully!",
            page: page,
            total: totalPages,
            users: allUsers,
        }

        res.status(200).send({data: response})
    } catch (err) {
        next(err);
    }
}

userController.getUserById = async (req, res, next) => {    
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const exception = new Error('Invalid id');
            throw exception;
        }
        const user = await User.findById(id, {isDeleted: false});
        if(!user) {
            const exception = new Error('User not found');
            throw exception;
        }
        const response = {message: "Get User Successfully!", user: user};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}

userController.getUserByName = async (req, res, next) => {    
    try{
        const {name} = req.params;
        const user = await User.find({name: name}, {isDeleted: false});
        if(!user) {
            const exception = new Error('User not found');
            throw exception;
        }
        const response = {message: "Get User Successfully!", user: user};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}

userController.deleteUser = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const exception = new Error('Invalid id');
            throw exception;
        }
        const user = await User.findById(id, {isDeleted: false});
        if(!user) {
            const exception = new Error('User not found');
            throw exception;
        }
        if (user.tasks.length > 0) {
            await Task.updateMany({_id: {$in: user.tasks}}, {assignedTo: null}, {new: true});
        }
        let deletedUser = await User.findByIdAndUpdate(id, {isDeleted: true});
        const response = {message: "Delete User Successfully!", user: deletedUser};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}

userController.removeTask = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const exception = new Error('Invalid id');
            throw exception;
        }
        let user = await User.findById(id, {isDeleted: false});
        const {tasks} = req.body;
        if (user.tasks.includes(tasks)) {
            await Task.findByIdAndUpdate(tasks, {assignedTo: null}, {new: true});
        }
        let userTasks = user.tasks.filter(task => !tasks.includes(task));
        let updatedUser = await User.findByIdAndUpdate(id, {tasks: userTasks}, {new: true});
        const response = {message: "Tasks removed successfully!", user: updatedUser};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}

userController.getTasksbyId = async (req, res, next) => {
    try{
        const {id} = req.params;
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            const exception = new Error('Invalid id');
            throw exception;
        }
        const user = await User.findById(id, {isDeleted: false});
        if(!user) {
            const exception = new Error('User not found');
            throw exception;
        }
        const response = {message: "Get Tasks Successfully!", tasks: user.tasks};
        res.status(200).send({data: response});
    } catch (err) {
        next(err);
    }
}


module.exports = userController;