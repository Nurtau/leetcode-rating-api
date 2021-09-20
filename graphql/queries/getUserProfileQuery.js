module.exports = (username) => {
  return {
    operationName: "getUserProfile",
    query: `
				query getUserProfile($username: String!) {
					matchedUser(username: $username) {
						submitStats {
							acSubmissionNum {
								count
							}
						}
					}
				}
			`,
    variables: {
      username,
    },
  };
};
