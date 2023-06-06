let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
const flash = require("./middlewares/flash");
let app = express();

// Moteur de template

app.set("view engine", "ejs");

// Middleware

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "ajaaaaakkkkkkk",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(require("./middlewares/flash"));
// Routes

app.get("/", (req, res) => {
  let Message = require("./models/message");
  Message.all(function (messages) {
    res.render("index", { messages: messages });
  });
});

app.get('/apropos', (req, res) => {
  res.render('apropos')
})

app.post("/", (req, res) => {
  if (req.body.message === undefined || req.body.message === "") {
    req.flash("error", "Oups! vous n'avez rien ecrit");
    res.redirect("/");
  } else {
    let Message = require("./models/message");
    Message.create(req.body.message, function () {
      req.flash("success", "Envoye !");
      res.redirect("/");
    });
  }
});

app.get("/message/:id", (req, res) => {
  let Message = require("./models/message");

  Message.find(req.params.id, function (message) {
    res.render("show", { message: message });
  });
});
app.listen(3000, (err) => {
  if (err) throw err;
  console.log("Nous ecoutons sur le port 3000");
});
