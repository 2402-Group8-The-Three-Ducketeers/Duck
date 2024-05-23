import express from 'express'
import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
const apiRouter = express.Router()
const prisma = new PrismaClient()

// check for a valid token and set our req.user to the user in the token
apiRouter.use((req, res, next) => {
  const auth = req.headers.authorization
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null
  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  }catch{
    req.user = null
  }
  next()
})

// get a user by their id
apiRouter.get('/finduser/:id', async (req, res, next) => {
  console.log("req.user: ", req.user)
  const { id } = req.params
  if(req.user.id !== id*1){
    return res.send("Please login to do that")
  }
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

// updating user info (authenticated for correct user and admin)
// this query can be used to update highscore, username, or nickname, and it wont break if you leave the other keys blank
apiRouter.put('/finduser/edit/:id', async (req, res, next) => {
  const { id } = req.params
  const { newUsername, newHighscore, newNickname } = req.body
  if(req.user.id !== id*1 && !req.user.isAdmin){
    return res.send("You are not allowed to change that username")
  }
  try{
    const updatedUser = await prisma.user.update({
      where: {
        id: id*1,
      },
      data: {
        username: newUsername,
        highscore: newHighscore*1,
        nickname: newNickname
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
  // if(!req.user){
  //   return res.send("Please login to do that")
  // }
  try{
    const users = await prisma.user.findMany()
    res.send(users)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// create a new friend pair
// (authenticated for members of the friendpair)
apiRouter.post('/friendpairs/create', async (req, res, next) => {
  const { friend1, friend2 } = req.body
  if(req.user.id !== friend1*1 && req.user.id !== friend2*1){
    return res.send("You can only make friendpairs that you are part of")
  }

  //make sure we dont already have a friendship between these users
  const friendCheck = await prisma.friendPair.findFirst({
    where: {
      OR: [
        {
          friend1Id: friend1*1,
          friend2Id: friend2*1
        },
        {
          friend1Id: friend2*1,
          friend2Id: friend1*1
        }
      ]
    }    
  })
  
  if(friendCheck){
    return res.send("Users are already friends")
  }

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

// get all friendpairs that include designated user
// (authenticated only for designated user and admins)
apiRouter.get('/friendpairs/allfriends/:userid', async (req, res, next) => {
  const { userid } = req.params
  if(req.user.id !== userid*1 && !req.user.isAdmin){
    return res.send("Must be signed in to get friends")
  }
  try{
    const foundFriends = await prisma.friendPair.findMany({
      where: {
        OR: [
          {
            friend1Id: userid*1
          },
          {
            friend2Id: userid*1
          }
        ]
      }
    })
    res.send(foundFriends)
  }catch (error){
    console.log(error)
    next(error)
  }
})

// delete a friendpair </3
// (authenticated for members of friendpair)
apiRouter.delete('/friendpairs/delete/:friendpairid', async (req, res, next) => {
  const { friendpairid } = req.params

  const { friend1Id, friend2Id } = await prisma.friendPair.findUnique({
    where: {
      id: friendpairid*1
    }
  })

  if(req.user.id !== friend1Id && req.user.id !== friend2Id ){
    return res.send("You can only delete friendpairs that you are part of")
  }

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

// create a new message (authenticated for message author)
apiRouter.post('/friendpairs/chat/:chatid', async (req, res, next) => {
  const { chatid } = req.params
  const { content } = req.body
  if(!req.user.id){
    return res.send("Must be signed in to send messages")
  }
  try{
    const newMessage = await prisma.message.create({
      data: {
        chatId: chatid*1,
        userId: req.user.id,
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

// update a message (authenticated for message authors and admins)
apiRouter.put('/friendpairs/chat/message/:messageid', async (req, res, next) => {
  const { messageid } = req.params
  const { newContent } = req.body
  const { userId } = await prisma.message.findUnique({
    where: {
      id: messageid*1
    }
  })
  if(req.user.id !== userId*1 && !req.user.isAdmin){
    return res.send("User does not have permission to change that message")
  }
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

// delete a message (authenticated for message authors and admins)
apiRouter.delete('/friendpairs/chat/message/:messageid', async (req, res, next) => {
  const { messageid } = req.params
  const { userId } = await prisma.message.findUnique({
    where: {
      id: messageid*1
    }
  })
  if(req.user.id !== userId && !req.user.isAdmin){
    return res.send("User does not have permission to delete that message")
  }
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