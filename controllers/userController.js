const validator = require("validator");

const User = require("../models/User");
const getScore = require("../graphql/getScore");

exports.addUser = async (req, res, next) => {

	try {
		const username = req.body.username;
		let link = req.body.link;
		link = "https://" + link.replace(/\/+$/, "").toLowerCase().replace(/^https:\/\//, "");

		// check of a validity of url
		if (!link.startsWith("https://leetcode.com") && !validator.isURL(link)) {
			return res.status(400).json({
				message:
					"The link is incorrect. It has to be in such format 'https://leetcode.com/Nurtau/'",
			});
		}

		//check if this account is already in db or not
    const user = await User.findOne({ link: link });
    if (user) {
      return res.status(406).json({
        message: `The account is already in database`,
      });
    }

		const scores = await getScore(link);

		// check of an account existence
		if (scores["easy"] === undefined) {
			return res.status(400).json({
				message: `There is no account in ${link}`,
			});
		}

		const scoreWithDate = { ...scores, date: new Date() };
		const newUser = new User({
			username: username,
			link: link,
			startScores: scoreWithDate,
			currentScores: scoreWithDate,
		});
		const savedUser = await newUser.save();
		res.status(201).json({ user: savedUser });
	} catch (err) {
		console.log("error during addUser");
		return res.status(500).json({ message: err.message });
	}
};

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		console.log("error during getUsers");
		return res.status(500).json({ message: err.message });
	}
};

exports.deleteUser = async (req, res, next) => {
	const username = req.params.username;
	try {
		const deletedUser = await User.findOneAndDelete({ username: username });
		if (!deletedUser) {
			return res
				.status(400)
				.json({ message: `There is no such user with ${username} username` });
		}
		res.status(204).json({
			message: "successfully deleted",
		});
	} catch (err) {
		console.log("error during deleteUser");
		return res.status(500).json({ message: err.message });
	}
};

exports.updateUsername = async (req, res, next) => {
	const prevUsername = req.body.prevUsername;
	const newUsername = req.body.newUsername;
	try {
		const user = await User.findOne({ username: prevUsername });
		if (!user) {
			return res.status(400).json("There is no such user");
		}
		user.username = newUsername;
		await user.save();
		res.status(200).json({ message: "successfully updated" });
	} catch (err) {
		console.log("error during updateUsername");
		return res.status(500).json({ message: err.message });
	}
};
