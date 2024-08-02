const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config()
const MONGODB_URL = process.env.MONGODB_URL



const db = async ()=>{
try{
    const con = await mongoose.connect(MONGODB_URL,{
        dbName: 'echo',
    })
   console.log(`mongo db connected : ${con.connection.host}/${con.connection.db.databaseName}`);
   
}catch(error){
console.error('erroer');

}
}
module.exports = db