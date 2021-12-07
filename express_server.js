const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set("view engine", "ejs");

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

 // show shortURL and longURL page
 app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);    // first server create 
});