const {app} = require(".");
const connectDB = require("./config/db");



const  PORT = 3000

const start = async () => {
 
 try {
  await connectDB()
  app.listen(PORT, () => {
   console.log('server is listening in port'+PORT)
  })
 } catch (error) {
   console.error(error)
 }
}



start();