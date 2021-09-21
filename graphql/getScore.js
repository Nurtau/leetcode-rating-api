const axios = require("axios");
const getUserProfileQuery = require("./queries/getUserProfileQuery");

module.exports = async (link, userCurrentScores) => {
	link = link.replace(/\/+$/, "");
	const splittedWords = link.split("/");
	const username = splittedWords[splittedWords.length - 1];
	try {
		if (!process.env.LEETCODE_LINK) {
			throw new Error("Please provide LEETCODE_LINK");
		}
		const { data } = await axios.post(
			process.env.LEETCODE_LINK,
			getUserProfileQuery(username),
			{}
		);
		const scores = data.data.matchedUser.submitStats.acSubmissionNum;
		if (scores.length > 0) {
			return {
				easy: scores[1].count,
				medium: scores[2].count,
				hard: scores[3].count,
			};
		} else {
			return userCurrentScores;
		}
	} catch (_) {
		return userCurrentScores;
	}
};
