import express from "express"; 
import dotenv from "dotenv"; 
import mongoose from "mongoose"; 
import cors from "cors"; 
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";


const app = express();  

await connectDB();
//Middlewares
app.use(cors()); 
app.use(express.json());  
dotenv.config(); 

const port = process.env.PORT || 3001; 

app.get("/", (req,res) => res.send("API working")); 
app.use("/api/admin",adminRouter); 
app.use("/api/blog",blogRouter);


app.listen(port,() => {
    console.log("Server started on",port)
}) 

export default app;