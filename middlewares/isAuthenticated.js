const isKeyCorrect = require("../utils/isKeyCorrect");

module.exports = async (req, res, next) => {
	const isCorrect = await isKeyCorrect(req);
	if (!isCorrect) {
		return res.status(401).json({
			message: "Please include a valid authorization key",
		});
	}
	next();
}