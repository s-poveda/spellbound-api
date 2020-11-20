const AuthService = require('../services/AuthService');

function requireAuth(req, res, next) {
	const authToken = req.get('Authorization') || '';
	let bearerToken = null;
	if (!authToken.toLowerCase().startsWith('bearer ')) {
		return res.status(401).json({ message: 'Missing bearer token' });
	} else {
		bearerToken = authToken.slice(7, authToken.length);
	}
	try {
		Promise.all([
			AuthService.verifyJwt(bearerToken),
			AuthService.getPayload(bearerToken),
		])
		//verifyJwt will throw if not successful
		.then(([ _, payload]) => {
			req.__JWT_PAYLOAD = payload;
			next();
		});
	} catch (e){
		res.status(401).json({ message: 'Unauthorized request' });
	}
}

module.exports = requireAuth;
