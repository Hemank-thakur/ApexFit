import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import chatbotRoutes from './routes/chatbot.route.js'
import authRoutes from './routes/auth.route.js'
import nutritionRoutes from './routes/nutrition.route.js'
import { protect } from './middleware/auth.middleware.js'


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
app.use("/auth/v1", authRoutes)
app.use("/bot/v1", protect, chatbotRoutes)
app.use("/nutrition/v1", protect, nutritionRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
