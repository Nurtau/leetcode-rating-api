const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	startScores: {
		easy: {
			type: Number,
			default: 0
		},
		medium: {
			type: Number,
			default: 0
		},
		hard: {
			type: Number,
			default: 0
		},
		date: {
			type: Date
		}
	},
	currentScores: {
		easy: {
			type: Number,
			default: 0
		},
		medium: {
			type: Number,
			default: 0
		},
		hard: {
			type: Number,
			default: 0
		},
		date: {
			type: Date
		}
	},
});

module.exports = mongoose.model("User", userSchema);