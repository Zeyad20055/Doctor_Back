const mongoose = require('mongoose');

const connectDB = async () => {
  
         try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connection the mongodb successfullY🟢🟢🟢🟢🟢")
    } catch (error) {
    console.log(  `❌❌❌❌❌Error in connection to MongoDB | ${error}`)
    process.exit()

    }
}


module.exports = connectDB