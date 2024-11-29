import express from "express"
import db from "./config/database.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
// import Users from "./models/UserModel.js"  //buat import di try catch minta otomatis sequelize bikinin tabel users
import router from "./routes/index.js"

dotenv.config()
const app = express()

try {
  await db.authenticate()
  console.log('database connected...')
  // await Users.sync() //berhubungan sama import Users diatas
} catch (error) {
  console.error(error)
}

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'anjay'
  })
})
app.use(cors('*'))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(3001, () => console.log('server running at port 3001'))