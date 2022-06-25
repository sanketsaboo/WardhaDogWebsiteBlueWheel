//initialization
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//home route
app.get("/", (req, res) => {
  res.render("home");
});

//gallery
app.get("/gallery", (req, res) => {
  res.render("gallery");
});

//about
app.get("/about", (req, res) => {
  res.render("about");
});

//projects
app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/forms", (req, res) => {
  res.render("forms");
});

//listen route
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server has been started at port " + PORT);
});
