const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);

app.get("/", (req, res) => {
    res.send("API Running 🚀");
  });

app.listen(3001,()=>{
    console.log("Server Started:3001......")
})












