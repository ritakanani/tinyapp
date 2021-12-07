const PORT = 8080; // default port 8080
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// set the view engine to ejs
app.set("view engine", "ejs");

// BodyParser needs to come before all of our routes. The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
//
//        MIDDLEWARE
//
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);      // output urlDatabse object in JSON string
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");  // output In html page, "Hello (bold)World" inside body
});

app.get("/set", (req, res) => {
  const a = 1;          
  res.send(`a = ${a}`);           // output a = 1
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);        // error: a is not defined
 });

 // index page
 app.get("/urls", (req, res) => {
   const templateVars = { urls: urlDatabase};
   res.render("urls_index", templateVars);
 });  // When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.

 // get route to show the Form
 app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

 // show shortURL and longURL page
 app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
  res.render("urls_show", templateVars);
});
// shorURL is stored the data in req.params in variable name. Like  http://localhost:8080/urls/b2xVn2 gives the result of longURL. 
// urlDatabase is requesting the value of req.params.shortURL(b2xVn2) = longURL. 




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);    // first server create 
});

// The order of route definitions matters! The GET /urls/new route needs to be defined before the GET /urls/:id route. Routes defined earlier will take precedence, so if we place this route after the /urls/:id definition, any calls to /urls/new will be handled by app.get("/urls/:id", ...) because Express will think that new is a route parameter. A good rule of thumb to follow is that routes should be ordered from most specific to least specific.