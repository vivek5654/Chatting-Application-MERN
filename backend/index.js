import express from 'express'; 
import authRoutes from './src/routes/auth.routes.js'; 
import messageRoutes from './src/routes/message.routes.js'; 
import dotenv from 'dotenv'
import connecDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { app, server } from './src/lib/socket.js';
import path from 'path';

dotenv.config()

const port = process.env.PORT || 3000;

const __dirname = path.resolve();



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());



app.use("/api/auth/", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")));
}

connecDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});