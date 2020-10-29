function restrict() {
	// put error messaage in variable so it can be re-used
	const authError = {
		message: "You Shall Not Pass",
	}

	return async (req, res, next) => {
		try {

			if (!req.session || !req.session.user) {
				return res.status(401).json(authError)
			}

			// if we reach this point, the user is authenticated!
			next()
		} catch (err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}