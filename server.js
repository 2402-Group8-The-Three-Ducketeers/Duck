import 'dotenv/config'
import express from 'express'
import { apiRouter } from './db/api/index.js'
import { authRouter } from './db/auth/index.js';

const PORT = process.env.PORT || 8080
const server = express();


server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// middleware serving front end
server.use(express.static("./dist"));


server.use('/api', apiRouter)
server.use('/auth', authRouter)

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})