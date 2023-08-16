const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// CREATE A POST
router.post("/", async (req, res) => {
	const newPost = new Post(req.body); //create a new post from requerst body
	try {
		const savedPost = await newPost.save(); // try to save it
		return res.status(200).json(savedPost); // if successfully saved return success status and return the post
	} catch (error) {
		return res.status(500).json(error); // return any errors
	}
});

// UPDATE A POST
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id); // try to find the post in the database
		// check if the useId of the post matches with the userId of the request body
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body }); // update the post with the contents of the request body
			return res.status(200).json("successfully updated post"); // return on success
		} else {
			return res.status(403).json("you can only update your own posts"); // if the userId's are not equal return a 403 status error
		}
	} catch (error) {
		return res.status(500).json(error); // return any errors
	}
});

// DELETE A POST
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id); // try to find the post in the database
		// check if the useId of the post matches with the userId of the request body
		if (post.userId === req.body.userId) {
			await post.deleteOne(); // delete the post
			return res.status(200).json("successfully deleted post"); // return on success
		} else {
			return res.status(403).json("you can only delete your own posts"); // if the userId's are not equal return a 403 status error
		}
	} catch (error) {
		return res.status(500).json(error); // return any errors
	}
});

// LIKE OR DISLIKE A POST
router.put("/:id/like", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id); // fetch post from database
		// check whether this likes array in post contains userId
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			return res.status(200).json("sucessfully liked post");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			return res.status(200).json("successfully disliked post");
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

// GET A POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id); // find post
		return res.status(200).json(post); // return post
	} catch (error) {
		return res.status(500).json(error);
	}
});

// GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.userId); // get current user
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPost = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		return res.status(200).json(userPosts.concat(...friendPost));
	} catch (error) {
		return res.status(500).json(error);
	}
});

// GET ALL USERS POSTS
router.get("/profile/:userName", async (req, res) => {
	try {
		const currentUser = await User.findOne({userName: req.params.userName}); // get current user
		const userPosts = await Post.find({ userId: currentUser._id });
		return res.status(200).json(userPosts);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;
