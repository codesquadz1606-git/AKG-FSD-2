const express=require("express");
const dbConnect = require("./db/db");
const router = require("./router/users.routes");
const app=express();

dbConnect()
app.use(express.json());
app.use("/",router)

module.exports=app;