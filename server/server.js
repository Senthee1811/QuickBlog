import express from "express"; 
import dotenv from "dotenv"; 
import mongoose from "mongoose"; 
import cors from "cors"; 


const app = express(); 
//Middlewares
app.use(cors()); 
app.use(express.json());  
dotenv.config();

const port = process.env.PORT || 3001; 

app.get("/", (req,res) => res.send("API working"))


app.listen(port,() => {
    console.log("Server started on",port)
}) 

export default app;