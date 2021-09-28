const User = require("../models/User");
const getScore = require("../graphql/getScore");

const changeScores = async (isReset) => {
  try {
    const users = await User.find();
    const savedUsers = [];
    const newScores = await Promise.all(
      users.map((user) => {
        return getScore(user.link, user.currentScores);
      })
    );
    await Promise.all(
      users.map((user, index) => {
        const scoresWithDate = { ...newScores[index], date: new Date() };
        if (isReset) {
          user.startScores = scoresWithDate;
        }
        user.currentScores = scoresWithDate;
        savedUsers.push(user);
        return user.save();
      })
    );
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
