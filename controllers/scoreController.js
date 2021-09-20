const User = require("../models/User");
const getScore = require("../graphql/getScore");

const changeScores = async (isReset) => {
	try {
		const users = await User.find();
		const savedUsers = [];
		for (let i = 0; i < users.length; i += 40) {
			let slicedUsers;
			if (i + 40 >= users.length) {
				slicedUsers = users.slice(i);
			} else {
				slicedUsers = users.slice(i, i + 40);
			}
			const promises = slicedUsers.map((user) => getScore(user.link));
			const newScores = await Promise.all(promises);

			for (let j = i, k = 0; j < users.length; j++, k++) {
				const scoresWithDate = { ...newScores[k], date: new Date() };
				if (isReset) {
					users[j].startScores = scoresWithDate;
				}
				users[j].currentScores = scoresWithDate;
				await users[j].save();
				savedUsers.push(users[j]);
			}
		}
		return savedUsers;
	} catch (err) {
		console.log("error during changeScores");
		throw err;
	}
};

exports.updateScores = async (req, res, next) => {
	try {
		const savedUsers = await changeScores(false);
		res.status(200).json(savedUsers);
	} catch (err) {
		console.log("error during updateScores");
		return res.status(500).json({ message: err.message });
	}
};

exports.resetScores = async (req, res, next) => {
	try {
		const savedUsers = await changeScores(true);
		res.status(200).json(savedUsers);
	} catch (err) {
		console.log("error during resetScores");
		return res.status(500).json({ message: err.message });
	}
};

const calculateScore = (startScores, currentScores) => {
	const ptForEasy = 3;
	const ptForMedium = 7;
	const ptForHard = 15;
	const numEasySolved = currentScores.easy - startScores.easy;
	const numMediumSolved = currentScores.medium - startScores.medium;
	const numHardSolved = currentScores.hard - startScores.hard;
	const totalScore =
		numEasySolved * ptForEasy +
		numMediumSolved * ptForMedium +
		numHardSolved * ptForHard;
	return totalScore;
};

exports.getRating = async (req, res, next) => {
	try {
		const usersRating = [];
		const users = await User.find();
		for (let user of users) {
			const totalScore = calculateScore(user.startScores, user.currentScores);
			usersRating.push({
				username: user.username,
				score: totalScore,
				id: user._id,
				link: user.link,
			});
		}
		const sortedRating = usersRating.sort((firstObj, secondObj) => {
			if (firstObj.score < secondObj.score) {
				return 1;
			} else {
				return -1;
			}
		});
		res.status(200).json(sortedRating);
	} catch (err) {
		console.log("error during getRating");
		return res.status(500).json({ message: err.message });
	}
};
