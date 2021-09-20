require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");
const scoreRouter = require("./routes/scoreRouter");

const app = express();

app.use(express.json());

//CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
	next();
});

app.use(userRouter);
app.use(scoreRouter);

//404 ERROR
app.use((req, res, next) => {
	res.status(404).json({ message: "There is no such command" });
});

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		app.listen(process.env.PORT || 4000);
		console.log("success");
	})
	.catch((err) => {
		console.log(err);
		return res.status(500).json({ message: err.message });
	});
