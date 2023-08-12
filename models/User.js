const mongoose = require("mongoose");

// user schema model
const UserSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			min: 3,
			max: 20,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
			min: 1,
			max: 25,
		},
		lastName: {
			type: String,
			required: true,
			min: 1,
			max: 250,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 25,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		coverPicture: {
			type: String,
			default: "",
		},
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		desc: {
			type: String,
			max: 50,
			default: "",
		},
		city: {
			type: String,
			max: 50,
			default: "",
		},
		from: {
			type: String,
			max: 50,
			default: "",
		},
		relationship: {
			type: Number,
			enum: [1, 2, 3],
			default: 1,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
