const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["manager", "employee"], required: true },
    tasks: { type: Array, optional: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
	collection: 'users',
  },
);

userSchema.pre(/^find/, function (next) {
	if (!('_conditions' in this)) return next();
	if (!('isDeleted' in userSchema.paths)) {
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

const User = mongoose.model("User", userSchema);
module.exports = User;