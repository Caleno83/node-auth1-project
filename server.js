const express = require("express")
const helmet = require("helmet")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("./data/config")
const usersRouter = require("./users/userRouter")

const server = express();

server.use(helmet())
server.use(express.json())
server.use(session({
	resave: false, // avoid recreating sessions that have not changed
	saveUninitialized: false, // to comply with GDPR laws
	secret: "keep it secret, keep it safe", // cryptographically sign the cookie
	store: new KnexSessionStore({
		knex: db, // configured instance of knex
		createtable: true, // if the sessions table doesn't exist, create it automatically
	}),
}))

server.use("/api", usersRouter)



server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

server.get("/", (req, res) => {
  res.send(`<h2>Welcome To My Module 1 Auth Project</h2>`);
});

module.exports = server;