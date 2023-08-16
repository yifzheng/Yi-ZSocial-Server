const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
	try {
		// generate a salt and generate hashed password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// create new user object
		const newUser = new User({
			userName: req.body.userName,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPassword,
		});
		// save user and return a reponse
		const user = await newUser.save();
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	console.log(req.body);
	// try to find user
	try {
		// find the user in database if exist
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json("User not found");
		}
		// hash password and compare if equal
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.status(400).json("Wrong password");
		}

		// if found and password the same return user object back
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;
