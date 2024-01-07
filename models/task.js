const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum:["pending", "working", "review", "done", "archive"], required: true },
    assignedTo: { type: String, optional: true },
    isDeleted: { type: Boolean, default: false },  
  },
  {
    timestamps: true,
	collection: 'tasks',
  }
);

taskSchema.pre(/^find/, function (next) {
	if (!('_conditions' in this)) return next();
	if (!('isDeleted' in taskSchema.paths)) {
		delete this['_conditions']['all'];
		return next();
	}
	if (!('all' in this['_conditions'])) {
		//@ts-ignore
		this['_conditions'].isDeleted = false;
	} else {
		delete this['_conditions']['all'];
	}
	next();
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;