const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
app.use(express.json());

app.use(
    cors({
      origin: [
        "http://localhost:5173",                 // dev frontend
        "https://emc-event-backend.onrender.com"       // prod frontend
      ],
      credentials: true
    })
  );



app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);

app.get("/", (req, res) => {
   return res.send("API Running 🚀");
  });

app.listen(3001,()=>{
    console.log("Server Started:3001......")
})












