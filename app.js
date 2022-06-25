//initialization
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");

//initializing firestore
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const Dogs = db.collection("dogs");

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
app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/addDog", async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const home = data.filter((dog) => {
    return dog.home === true;
  });
  res.render("forms", { length: home.length });
});

app.get("/editDog/:id", async (req, res) => {
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

app.post("/editDog/:id", async (req, res) => {
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
  res.redirect("/alldogs");
});

app.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  await Dogs.doc(id).delete();
  res.send("Deleted");
});

app.post("/forms", async (req, res) => {
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
  res.send("Updated");
});

app.get("/alldogs", async (req, res) => {
  const dogs = await Dogs.get();
  const data = dogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.render("alldogs", { dogs: data });
});

app.get("/data", async (req, res) => {
  const snapshot = await db.collection("dogs").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data().sex);
  });
  res.send("Data updated");
});

//listen route
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server has been started at port " + PORT);
});
