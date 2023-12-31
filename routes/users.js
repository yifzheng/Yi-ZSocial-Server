const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
	if (req.body.userId == req.params.id || req.body.isAdmin) {
		// if user is tryingto change password
		if (req.body.password) {
			try {
				// gen new salt and rehash password
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (error) {
				return res.status(500).json(error);
			}
		}
		try {
			// find user
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been updated");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("You can only update your account");
	}
});

// DELETE USER
router.delete("/:id", async (req, res) => {
	if (req.body.userId == req.params.id || req.body.isAdmin) {
		try {
			// find user
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted successfully");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("You can only delete your account");
	}
});

// GET A USER
router.get("/", async (req, res) => {
	const userId = req.query.userId;
	const userName = req.query.userName;
	try {
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ userName });
		// remove unecessary properties from retrieved user object before sending back to user
		const { password, updatedAt, ...other } = user._doc; // '_doc' equates to the user object returned from search
		return res.status(200).json(other);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// GET FRIENDS
router.get("/friends/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId); // get current user
		// promise all: loop through following array for current user and return user object for each id in the array
		const friends = await Promise.all(
			user.following.map((friendId) => {
				return User.findById(friendId);
			})
		);
		let friendList = [];
		friends.map((friend) => {
			const { _id, profilePicture, userName } = friend;
			friendList.push({ _id, profilePicture, userName });
		});
		return res.status(200).json(friendList);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// SEARCH USERS BY USERNAME
router.get("/search", async (req, res) => {
	const { query } = req.query;

	try {
		const users = await User.find({ userName: { $regex: query, $options: "i" } });
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); // user to follow
			const currentUser = await User.findById(req.body.userId); // current user trying to follow the user
			// check if the user already contains the id of the current user in the followers list
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({
					$push: { following: req.params.id },
				});
				return res.status(200).json("Successfully followed the user");
			} else {
				return res.status(403).json("You already followed this user");
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("You can not follow yourself");
	}
});

// UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); // user to follow
			const currentUser = await User.findById(req.body.userId); // current user trying to follow the user
			// check if the user already contains the id of the current user in the followers list
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({
					$pull: { following: req.params.id },
				});
				return res.status(200).json("Successfully unfollowed the user");
			} else {
				return res.status(403).json("You don't follow this user");
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("You can not unfollow yourself");
	}
});

module.exports = router;
