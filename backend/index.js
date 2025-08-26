import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import chatbotRoutes from './routes/chatbot.route.js'


const app = express()
dotenv.config()

const port =process.env.PORT || 3000

//middleware
app.use(express.json());
app.use(cors())

//database connection
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected to mongodb")
}).catch((error)=>{
    console.log("error detected",error)
})


//defining routes
app.use("/bot/v1",chatbotRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
