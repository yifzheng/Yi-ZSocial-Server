const express = require("express"); // express dependency
const app = express(); // create the application
const mongoose = require("mongoose"); // get mongoose for mongoDB
const dotenv = require("dotenv"); // used for environmental variables
const helment = require("helmet"); // used for secure https connection
const morgan = require("morgan"); // used for server responses
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// configurate environmental variables
dotenv.config();

// mongoose connection to MongoDB
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("Failed to connected to MongoDB: ", error));

// middleware
app.use(express.json());
app.use(helment());
app.use(morgan("common"));

// api routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
	console.log("Backend server is running");
});
