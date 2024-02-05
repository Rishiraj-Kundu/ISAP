const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const path = require('path');
const userRouter = require("./api/users/user.router");   // to use router module
const courseRouter = require("./api/course/course.route");

app.set("view engine", "ejs");   //ejs template for sending data from backend to frontend
app.set('views', path.join(__dirname, 'views'));  // saying where our view folder is
//app.set('views',  'views');
var bodyParser = require("body-parser");      // used for getting data from frontend
app.use(bodyParser.urlencoded({ extended: true }));     // say to get url link data
app.use(bodyParser.json());            //say to get json data from frontend
app.use(express.json());  

const connection=require("./config/db");       // need to acces db.js file
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = 'your-secret-key';
//app.use(express.static(__dirname + "/public"));   //say to use all html file of frontend
app.use(express.static(path.join(__dirname, 'public')));    //builtin middleware to allow to use all file in public
//console.log(path.join(__dirname, 'public'));
//app.use(express.static(path.join(__dirname, 'views')));  //including all te file of view for the operation
//console.log(path.join(__dirname, 'views'));
//middleware to set router
app.use("/api/users",userRouter);   //foward my url start from api/users/ to UserRout
app.use(express.json());
app.use(cookie());
app.use("/api/course",courseRouter); 

// Middleware function for authentication
function authenticate(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Login route to generate JWT
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Check the user credentials against the MySQL database
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // Check if a user with the provided credentials exists
    if (results.length === 0) {
      //return res.status(401).json({ message: 'Invalid credentials' });
      res.render("invalid_id.ejs");
    }
    // User authentication successful, generate JWT token
    else {
    const user = results[0];
    //console.log(user);
    let user_name = (user.firstname);
    const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname }, secretKey);

    // Render the course.ejs template and pass user information
    res.render('course', { user_name });  }
  });
});


app.get('/logout', (req, res) => {
  //res.json({ message: 'Logout successful' });
  res.render("index");
});

app.get('/betutor', (req, res) => {
  //res.json({ message: 'Logout successful' });
  res.render("tutor");
});

app.get('/enroll', (req, res) => {
  //res.json({ message: 'Logout successful' });
  res.render("course101");
});

app.get('/admin_login', (req, res) => {
  //res.json({ message: 'Logout successful' });
  res.render("admin_login");
});

app.get("/", (req, res) => {
  console.log("Home page entered");
  res.render("index");
  //res.redirect("/register.ejs");
  //res.send("hello jee");
  
});
// to refer on sign page
app.get('/sign', (req, res) => {
  res.render('sign');
});

app.get('/course', (req, res) => {
  res.render('course.ejs');
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});

app.get('/reset', (req, res) => {
  res.render('reset.ejs');
});

app.get("/admin", (req, res) => {
    res.redirect("/admin.html");
  });

app.post("/upload-course", (req, res) => {
    res.render("upload_msg");
  });

app.get("/register", (req, res) => {
    res.redirect("/register.html");
  });
app.get('/redirect', (req, res) => {
    console.log(" button click register");
    res.render("register.ejs");
});

app.post('/submit_quiz', (req, res) => {
  const userAnswers = req.body;

  // Define the correct answers and corresponding marks
  const correctAnswers = {
   q1: 'b',
    q2: 'c',
    q3: 'c',
    q4: 'c',
    q5: 'c',
    q6: 'b',
    q7: 'c',
    q8: 'b',
    q9: 'c',
    q10: 'c',
  };

  let totalMarks = 0;

  // Check user answers and calculate marks
  for (const question in correctAnswers) {
    if (userAnswers.hasOwnProperty(question) && userAnswers[question] === correctAnswers[question]) {
      totalMarks += 10; // Each correct answer is worth 10 marks
    }
  }

  // Redirect based on total marks
  if (totalMarks > 50) {
    //res.redirect('/pass'); // Redirect to a pass page
    res.render('pass', { marks: totalMarks });
  } else {
    //res.redirect('/fail'); // Redirect to a fail page
    res.render('fail', { marks: totalMarks });
  }
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
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.error('Error querying MySQL:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        } if (results.length > 0) {
          // Email is already in use
          res.render("email_already_exist.ejs");
        } else {
 
 
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
  }})} catch (err) {
    res.send(err);
  }
});

app.post('/tutor_register', (req, res) => {
  const { fullName, email, subject, experience, qualification, availability } = req.body;

  const insertQuery = `
      INSERT INTO tutors (fullName, email, subject, experience, qualification, availability)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(insertQuery, [fullName, email, subject, experience, qualification, availability], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Error inserting data');
      } else {
          console.log('Data inserted successfully');
          res.render("tutor_msg");
      }
  });
});


app.get("/tutor_login", (req, res) => {
  res.render("tutor_login");
});

app.get("/reupload", (req, res) => {
  res.render("tutor_upload");
});
app.post('/tutor_login_action', (req, res) => {
  console.log("tutor action hit.....");
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, " ", password);
  // Check the database for authentication
  const query = 'SELECT * FROM tutor_approved_list WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.render('error');
    } else {
      if (results.length > 0) {
        // Authentication successful
        res.render('tutor_upload');
      } else {
        // Invalid login
        res.render('tutor_invalid');
      }
    }
  });
});

app.post('/admin_login', (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  const sql = 'SELECT * FROM admin_users WHERE email = ?';

  connection.query(sql, [email], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }

      // Check if user exists and password is correct
      if (results.length > 0 && password === results[0].password) {
          // Successful login
          console.log("admin logeedd again");
          res.redirect('/display');
      } else {
          // Failed login
          
          res.render('admin_login_failed');
      }
  });
});

app.get('/display', (req, res) => {
  const query = 'SELECT * FROM tutors WHERE approve = 0';

  connection.query(query, (err, results) => {
    if (err) throw err;

    res.render('admin_manage', { tutors: results });
  });
});

app.post('/approve/:id', (req, res) => {
  const tutorId = req.params.id;
  const { fullName, email, password } = req.body;

  // Insert into tutor_approved_list
  connection.query(
    'INSERT INTO tutor_approved_list (full_name, email, password) VALUES (?, ?, ?)',
    [fullName, email, password],
    (error) => {
      if (error) throw error;
    }
  );

  // Update approved value in tutors table
  connection.query(
    'UPDATE tutors SET approve = 1 WHERE id = ?',
    [tutorId],
    (updateError) => {
      if (updateError) throw updateError;
      res.render('tutor_approved', { fullName });
    }
  );
});

app.post('/reset-password', (req, res) => {
  const { firstName, lastName, email, newPassword } = req.body;

  // Check if the user with the provided details exists in the database
  connection.query(
    'SELECT * FROM users WHERE firstName = ? AND lastName = ? AND email = ?',
    [firstName, lastName, email],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).send('User not found or details do not match');
      }

      // Update the user's password
      connection.query(
        'UPDATE users SET password = ? WHERE firstName = ? AND lastName = ? AND email = ?',
        [newPassword, firstName, lastName, email],
        (updateErr, updateResults) => {
          if (updateErr) throw updateErr;

          res.render('reset_msg.ejs');
        }
      );
    }
  );
});
    

app.listen(4600);
console.log("Server running.... on port 4600");
