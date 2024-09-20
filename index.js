import express from "express";
import mongoose from "mongoose";
import { userdata } from "./models/todo.js";

const app = express();
const port = 3000;

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  const name = "";
  res.render("signup", { olduser: name });
});

app.get("/login", (req, res) => {
  const message = "";
  res.render("login", { incPass: message });
});

app.get("/signup", (req, res) => {
  const name = "";
  res.render("signup", { olduser: name });
});

app.post("/signup", async (req, res) => {
  const usercredentials = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const find = await userdata.findOne({ username: req.body.username });
    if (find && find.password === req.body.password) {
      const message = "User already registered";
      res.render("signup", { olduser: message });
      return;
    }

    const newuser = new userdata(usercredentials);
    await newuser.save();
    res.render("login", { incPass: "" });
    res.render("login");
  } catch (error) {
    res.status(500).send("Error 404", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const find = await userdata.findOne({ username: req.body.username });
    if (find) {
      if (find.password === req.body.password) {
        res.send("Welcome to Homepage");
      } else {
        const message = "Incorrect password";
        res.render("login", { incPass: message });
      }
    } else {
      const message = "User not found";
      res.render("login", { incPass: message });
    }
  } catch (error) {
    res.status(500).send("Error 404", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});