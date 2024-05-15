import express from 'express'
import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
// import jwt from "jsonwebtoken"
const apiRouter = express.Router()
const prisma = new PrismaClient()

// apiRouter.use((req, res, next) => {
//   const 
// })

// get a user by their id
apiRouter.get('/finduser/:id', async (req, res, next) => {
  const { id } = req.params
  try{
    const user = await prisma.user.findUnique({
      where: {
        id: id*1
      },
    })
    res.send(user)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// updating a high score (should authenticate we are correct user or admin)
apiRouter.put('/finduser/:id', async (req, res, next) => {
  const { id } = req.params
  const { newHighscore } = req.body // might be a little tough to pass score data from the game
  try{
    const updatedHighscore = await prisma.user.update({
      where: {
        id: id*1,
      },
      data: {
        highscore: newHighscore*1
      }
    })
    res.send(updatedHighscore)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// change username (should authenticate we are correct user or admin)
apiRouter.put('/finduser/edit/:id', async (req, res, next) => {
  const { id } = req.params
  const { newUsername } = req.body
  try{
    const updatedUser = await prisma.user.update({
      where: {
        id: id*1,
      },
      data: {
        username: newUsername
      }
    })
    res.send(updatedUser)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// find all users (for admins and for the leaderboard)
apiRouter.get('/allusers', async (req, res, next) => {
  try{
    const users = await prisma.user.findMany()
    res.send(users)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// create a new friend pair
apiRouter.post('/friendpairs', async (req, res, next) => {
  const { friend1, friend2 } = req.body
  try{
    const newFriendPair = await prisma.friendPair.create({
      data: {
        friend1Id: friend1*1,
        friend2Id: friend2*1,
      }
    })
    res.send(newFriendPair)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// create a new chat (might be a way to do this with new friend pairs)
apiRouter.post('/friendpairs/:friendpairid', async (req, res, next) => {
  const { friendpairid } = req.params
  try{
    const newChat = await prisma.chat.create({
      data: {
        friendPairId: friendpairid*1
      }
    })
    res.send(newChat)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// delete a friendpair </3
// (should probably authenticate that we are the right user)
apiRouter.delete('/friendpairs/:friendpairid', async (req, res, next) => {
  const { friendpairid } = req.params
  try{ 
    const friendPairToDelete = await prisma.friendPair.delete({
      where: {
        id: friendpairid*1
      }
    })
    res.send(friendPairToDelete)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// create a new message
apiRouter.post('/friendpairs/chat/:chatid', async (req, res, next) => {
  const { chatid } = req.params
  const { userId, content } = req.body
  try{
    const newMessage = await prisma.message.create({
      data: {
        chatId: chatid*1,
        userId: userId*1,
        content: content
      }
    })
    res.send(newMessage)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// get all messages from a chat
apiRouter.get('/friendpairs/chat/:chatid/allmessages', async (req, res, next) => {
  const { chatid } = req.params
  try{
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatid*1
      }
    })
    res.send(messages)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// update a message (should authenticate we are correct user or admin)
apiRouter.put('/friendpairs/chat/message/:messageid', async (req, res, next) => {
  const { messageid } = req.params
  const { newContent } = req.body
  try{
    const updatedMessage = await prisma.message.update({
      where: {
        id: messageid*1
      },
      data: {
        content: newContent
      }
    })
    res.send(updatedMessage)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// delete a message
apiRouter.delete('/friendpairs/chat/message/:messageid', async (req, res, next) => {
  const { messageid } = req.params
  try{
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageid*1
      }
    })
    res.send(deletedMessage)
  }catch (error){
    console.log(error)
    next(error)
  }
})

export { apiRouter }