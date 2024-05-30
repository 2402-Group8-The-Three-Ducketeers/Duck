import 'dotenv/config'
import express, { request } from 'express'
import { apiRouter } from './db/api/index.js'
import { authRouter } from './db/auth/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 8080
const server = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//middleware for serving front end
for (const path of ["/", "/login", "/register", "/game", "/board", "/admin", "/info", "/profile"])
server.use(path, express.static("./dist"));

server.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/dist/index.html")
})

//backend api paths
server.use('/api', apiRouter)
server.use('/auth', authRouter)

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})