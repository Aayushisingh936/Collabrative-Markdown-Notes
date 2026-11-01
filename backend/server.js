import notesRouter from "./routes/notes.js"
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRouter)

app.get("/", (req, res) => {
    res.send("Collabrative Markdown Notes API is running")
}); 

mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log("MongoDB connected successfully!")
        
        const PORT = process.env.PORT || 5000;
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });
