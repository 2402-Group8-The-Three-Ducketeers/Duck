import express, { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const jwt = jsonwebtoken
const prisma = new PrismaClient()
const authRouter = express.Router()

authRouter.post("/register", async (req, res, next) => {
  const {username, password, nickname } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try{
    const userToRegister = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        nickname: nickname
      }
    })
    const token = jwt.sign({ id: userToRegister.id }, process.env.JWT_SECRET)
    res.send({ token })
  }catch (error){
    console.log(error)
    next(error)
  }
})

authRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body
  const foundUser = await prisma.user.findUnique({
    where: {
      username: username
    }
  })
  const pwCompare = await bcrypt.compare(password, foundUser.password)
  if(pwCompare !== true){
    return res.send("Invalid login credentials")
  }

  try{
    const userToLogin = await prisma.user.findUnique({
      where: {
        username: username,
        password: foundUser.password
      }
    })

    const token = jwt.sign({ id: userToLogin.id, isAdmin: userToLogin.isAdmin }, process.env.JWT_SECRET)
    console.log("Logged in")
    res.send({ token })
  }catch (error){
    console.log(error)
    next(error)
  }
})

export { authRouter }