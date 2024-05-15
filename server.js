import 'dotenv/config'
import express from 'express'
import { apiRouter } from './db/api/index.js'
import { authRouter } from './db/auth/index.js';

const PORT = process.env.PORT || 8080
const server = express();

// //middleware
//server.use(express.static("./dist"));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', async (req, res, next) => {
  try{
    await res.send("Lets do some duck gaming!!!!")
  }catch(error){
    next(error)
  }
})

server.use('/api', apiRouter)
server.use('/auth', authRouter)

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})