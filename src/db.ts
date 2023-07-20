import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: (__dirname) + "/.env",
});


var db = process.env.MONGO_DB || "development";
var db_user = process.env.MONGO_USER || "admin";
var db_password = process.env.MONGO_PASS;

const MONGO_URI = `mongodb+srv://${db_user}:${db_password}@cluster0.mbcxzqo.mongodb.net/${db}?retryWrites=true&w=majority`;

console.log(MONGO_URI);

const dbConnect = async () => mongoose.connect(MONGO_URI);

export default dbConnect;
