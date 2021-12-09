const PORT = 8080; // default port 8080
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// set the view engine to ejs
app.set("view engine", "ejs");

// BodyParser needs to come before all of our routes. The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
//
//        MIDDLEWARE
//
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()); // bring in cookie-parser

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

function generateRandomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = "";

  for (let i = 6; i > 0; --i) {
  result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}


// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);      // output urlDatabse object in JSON string
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");  // output In html page, "Hello (bold)World" inside body
// });

// app.get("/set", (req, res) => {
//   const a = 1;          
//   res.send(`a = ${a}`);           // output a = 1
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);        // error: a is not defined
//  });


 // // index page  // //

 app.get("/urls", (req, res) => {
   const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
   console.log(templateVars.username);
   
   
   res.render("urls_index", templateVars);
 });  // When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.


 // get route to show the Form
 app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],    
  };
  console.log(templateVars);
  res.render("urls_new", templateVars);
  
});

// //   LOG IN // //

app.post("/login", (req, res) => {
  // console.log("username", req.body);  // from body username box, longURL is username 
  res.cookie("username", req.body.email);   // set the cookie for username
  // console.log("username", req.body);
  res.redirect("/urls");
});

// // LOG OUT  // //

app.post("/logout", (req, res) => {
  let clearUsername = req.body.email;
    res.clearCookie("username", clearUsername);
    res.redirect("/urls");
});

// // REGISTER // //

app.post("/register", (req, res) => {
  // console.log("req.body", req.body);
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(400).send("require valid email and password");
  }

  for (let user of Object.values(users)) {
    if(user[email] === email) {
       return res.status(400).send("user already in use");
    }
  }
  
  const user_id = generateRandomString();
  users[user_id] = { id: user_id, email: req.body.email, password: req.body.password };
  
  res.cookie("username", users[user_id]);  

  res.redirect("/urls"); 
});

// //      EDIT   // //

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

//  //  DELETE  //  //

app.post("/urls/:shortURL/delete", (req, res) => { 
  let shortURL = req.params.shortURL;  
  delete urlDatabase[shortURL];  
  res.redirect("/urls");  
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");
  // Respond with 'Ok' (we will replace this)
  let longURL = req.body.longURL;   // requesting data(longlink) from server
  let shortURL = generateRandomString();   // 6 char shortURL called by function
  urlDatabase[shortURL] = longURL;     // shortURL becomes key of urlDatabase and it's value is longURL
  res.redirect(`/urls/${shortURL}`);  
});  
// When we submit the link redirect to /urls/${shortURL}


 // show shortURL and longURL page
 app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});
// shorURL is stored the data in req.params in variable name. Like  http://localhost:8080/urls/b2xVn2 gives the result of longURL. 
// urlDatabase is requesting the value of req.params.shortURL(b2xVn2) = longURL. 


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// // LOG IN  // //

app.get("/login", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  

  res.render("register", templateVars);
});

// // REGISTER  // //

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };


  res.render("register", templateVars);
});






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);    // first server create 
});

// The order of route definitions matters! The GET /urls/new route needs to be defined before the GET /urls/:id route. Routes defined earlier will take precedence, so if we place this route after the /urls/:id definition, any calls to /urls/new will be handled by app.get("/urls/:id", ...) because Express will think that new is a route parameter. A good rule of thumb to follow is that routes should be ordered from most specific to least specific.

// Let's have a look at how this functionality fits in with the overall flow of our app:

// 1. After we generate our new shortURL, we add it to our database.
// 2.Our server then responds with a redirect to /urls/:shortURL.
// 3.Our browser then makes a GET request to /urls/:shortURL.
// 4.Our server looks up the longURL from the database, sends the shortURL and longURL to the urls_show template, generates the HTML, and then sends this HTML back to the browser.
// 5.The browser then renders this HTML.