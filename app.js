//initialization
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());
app.set("view engine", "ejs");
const bcrypt = require("bcrypt");
const adminAuth = require("./adminAuth");
//initializing firestore
const { initializeApp, cert } = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const Dogs = db.collection("dogs");
const Initiatives = db.collection("initiatives");
const Admins = db.collection("admins");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//home route
app.get("/", async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const home = data.filter((dog) => {
    return dog.home === true;
  });
  console.log(home);
  res.render("home", { homedogs: home });
});

//gallery
app.get("/gallery", async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const home = data.filter((dog) => {
    return dog.home === true;
  });
  console.log(data);
  res.render("gallery", { dogs: data });
});

//about
app.get("/about", (req, res) => {
  res.render("about");
});

//projects
app.get("/projects", async (req, res) => {
  // const dogs = await Initiatives.get();
  // const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // res.render("projects", { initiatives: data });
  res.render("projects");
});

app.get("/nftdetails", async (req, res) => {
  // const dogs = await Initiatives.get();
  // const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // res.render("projects", { initiatives: data });
  res.render("details");
});

app.get("/admin/addDog", adminAuth, async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const home = data.filter((dog) => {
    return dog.home === true;
  });
  res.render("forms", { length: home.length });
});

app.get("/admin/editDog/:id", adminAuth, async (req, res) => {
  console.log(req.params.id);
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const dog = data.filter((dog) => {
    return dog.id == req.params.id;
  });
  const home = data.filter((dog) => {
    return dog.home == true;
  });
  console.log(home);
  console.log(home.length);
  res.render("updateforms", { dog: dog[0], length: home.length });
});

app.post("/admin/editDog/:id", adminAuth, async (req, res) => {
  const data = req.body;
  console.log(data);
  id = req.params.id;
  const saveData = {};
  if (data.vaccinated) {
    saveData["vaccinated"] = true;
  } else {
    saveData["vaccinated"] = false;
  }
  if (data.spayed) {
    saveData["spayed"] = true;
  } else {
    saveData["spayed"] = false;
  }
  if (data.neutered) {
    saveData["neutered"] = true;
  } else {
    saveData["neutered"] = false;
  }
  if (data.home) {
    saveData["home"] = true;
  } else {
    saveData["home"] = false;
  }

  saveData["story"] = data.story;
  saveData["nftlink"] = data.nftlink;
  saveData["name"] = data.name;
  saveData["age"] = parseInt(data.age);
  // 1 for male
  // 0 for female
  saveData["sex"] = parseInt(data.sex);
  await Dogs.doc(id).update(saveData);
  res.redirect("/admin/alldogs");
});

app.get("/admin/delete/:id", adminAuth, async (req, res) => {
  let id = req.params.id;
  await Dogs.doc(id).delete();
  res.redirect("/admin/alldogs");
});

app.post("/admin/forms", adminAuth, async (req, res) => {
  const data = req.body;
  console.log(data);
  const saveData = {};
  if (data.vaccinated) {
    saveData["vaccinated"] = true;
  } else {
    saveData["vaccinated"] = false;
  }
  if (data.spayed) {
    saveData["spayed"] = true;
  } else {
    saveData["spayed"] = false;
  }
  if (data.neutered) {
    saveData["neutered"] = true;
  } else {
    saveData["neutered"] = false;
  }
  if (data.home) {
    saveData["home"] = true;
  } else {
    saveData["home"] = false;
  }

  saveData["story"] = data.story;
  saveData["nftlink"] = data.nftlink;
  saveData["name"] = data.name;
  saveData["age"] = parseInt(data.age);
  // 1 for male
  // 0 for female
  saveData["sex"] = parseInt(data.sex);
  await Dogs.add(saveData);
  res.redirect("/admin/alldogs");
});

app.get("/admin/alldogs", adminAuth, async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.render("alldogs", { dogs: data });
});

app.get("/data", adminAuth, async (req, res) => {
  const snapshot = await db.collection("dogs").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data().sex);
  });
  res.send("Data updated");
});

app.get("/admin/addInitiatives", adminAuth, (req, res) => {
  res.render("addInitiatives");
});

app.post("/admin/addInitiatives", adminAuth, async (req, res) => {
  const savedData = {
    heading: req.body.heading,
    content: req.body.content,
  };
  await Initiatives.add(savedData);
  res.redirect("/admin/allinitiatives");
});

app.get("/admin/editInitiatives/:id", adminAuth, async (req, res) => {
  const data = await Initiatives.get();
  const initiatives = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const initiative = initiatives.filter((data) => {
    return data.id == req.params.id;
  });
  res.render("editInitiative", { initiative: initiative[0] });
});

app.get("/admin/allinitiatives", async (req, res) => {
  const data = await Initiatives.get();
  const initiatives = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.render("allInitiatives", { initiatives });
});

app.post("/admin/editInitiative/:id", adminAuth, async (req, res) => {
  var id = req.params.id;
  data = {
    heading: req.body.heading,
    content: req.body.content,
  };
  Initiatives.doc(id).update(data);
  res.redirect("/admin/allinitiatives");
});
app.get("/admin/deleteInitiatives/:id", adminAuth, (req, res) => {
  const id = req.params.id;
  Initiatives.doc(id).delete();
  res.redirect("/admin/allinitiatives");
});

app.get("/adminLogin", async (req, res) => {
  res.render("login");
});

// app.get("/register", async (req, res) => {
//   var email = "janwaoptional@gmail.com";
//   var password = "janwa@123";
//   const salt = await bcrypt.genSalt(10);
//   const hashedPass = await bcrypt.hash(password, salt);
//   const data = {
//     email,
//     password: hashedPass,
//   };
//   await Admins.add(data);
//   res.send({ msg: "User added" });
// });

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const options = { maxAge: expiresIn, httpOnly: true };

    // try {

    var data = await Admins.get();
    data = data.docs[0].data();
    console.log(data.email);
    // res.send(data);
    if (email !== data.email) {
      console.log("emails do not match");
      res.redirect("/adminLogin");
    }
    const isMatch = await bcrypt.compare(password, data.password);
    // console.log(isMatch);
    if (!isMatch) {
      console.log("passwords do not match");
      res.redirect("/adminLogin");
    }

    const payload = {
      user: {
        email: data.email,
        admin: true,
      },
    };
    console.log(process.env.jwtSecret);
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: 360000,
    });
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.redirect("/admin/alldogs");
  } catch {
    console.log("Something went wrong");
  }
});

//listen route
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server has been started at port " + PORT);
});
