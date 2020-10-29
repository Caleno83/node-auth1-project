const express = require("express")
const db = require("./userModel")
const bcrypt = require("bcryptjs")
const { restrict } = require("./userMiddleware")
const router = express.Router()

router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await db.find())
	} catch(err) {
		next(err)
	}
})

router.post("/register", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await db.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "You Shall Not Pass",
			})
		}

		// const newUser = await Users.add({
		// 	username,
		// 	password,
		// })

		const newUser = await db.add({
			username,
			// hash the password with a time complexity of "14"
			password: await bcrypt.hash(password, 14),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
	
		const { username, password } = req.body
		const user = await db.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "You Shall Not Pass",
			})
		}

		// compare the plain text password from the request body to the
		// hash we have stored in the database. returns true/false.
		const passwordValid = await bcrypt.compare(password, user.password)

		// check if hash of request body password matches the hash we already have
		if (!passwordValid) {
			return res.status(401).json({
				message: "You Shall Not Pass",
			})
		}

		// // // create a new session for the user
		req.session.user = user

		res.json({
			message: `Login with ID ${user.id}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", restrict(), async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router
