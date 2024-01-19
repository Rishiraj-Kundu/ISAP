const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const path = require('path');

app.set("view engine", "ejs");   //ejs template for sending data from backend to frontend

var bodyParser = require("body-parser");      // used for getting data from frontend
app.use(bodyParser.urlencoded({ extended: true }));     // say to get url link data
app.use(bodyParser.json());            //say to get json data from frontend

const connection=require("./config/db");       // need to acces db.js file

//app.use(express.static(__dirname + "/public"));   //say to use all html file of frontend
app.use(express.static(path.join(__dirname, 'public')));    //builtin middleware to allow to use all file in public
//console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'views')));  //including all te file of view for the operation
app.get("/", (req, res) => {
  res.redirect("/home.html");
  
});

app.get("/admin", (req, res) => {
    res.redirect("/admin.html");
  });

  app.get("/register", (req, res) => {
    res.redirect("/register.html");
  });

app.post("/create", (req, res) => {
    try {
       console.log(req.body);
    }
    catch(err){
        console.log(err);
    }
  });
var user_name="";
app.get("/data", (req, res) => {
    const allData = "select * from users";
    var my_name="Ranjeet"
    connection.query(allData, (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        // res.json({ rows });
        res.render("read.ejs", { user_name });    //render use to send the data in html
      }
    });
  });
app.post("/register_user_data", (req, res) => {
    console.log(req.body);
    var f_name = req.body.firstname;
    var l_name = req.body.lastname;
    var email = req.body.email;
    var pass= req.body.password;

    user_name=f_name+" "+l_name;
  try {
    connection.query(
      "INSERT into users (firstname,lastname,email,password) values(?,?,?,?)", 
      [f_name,l_name, email,pass],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");  
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});
    

app.listen(4600);
console.log("Server running.... on port 4600");