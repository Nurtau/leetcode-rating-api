const bcrypt = require('bcrypt');

module.exports = async (req) => {
	const authKey = req.headers.authorization ?? "";
	const isSame = await bcrypt.compare(authKey, process.env.AUTH_HASHED_KEY);
	return isSame;
}