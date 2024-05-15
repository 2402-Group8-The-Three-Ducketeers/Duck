import express, { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const jwt = jsonwebtoken
const prisma = new PrismaClient()
const authRouter = express.Router()

Router.post("/register", async (req, res, next) => {
  const {username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try{
    const userToRegister = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      }
    })
  }catch (error){
    console.log(error)
    next(error)
  }
})

export { authRouter }