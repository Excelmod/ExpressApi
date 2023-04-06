const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
	const { user, password } = req.body;
	if (!user || !password)
		return res
			.status(400)
			.json({ message: 'Username and password are required.' });

	const foundUser = User.findOne({ username: user }).exec();
	if (!foundUser) return res.sendStatus(401);
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
