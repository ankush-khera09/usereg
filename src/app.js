// importing express module
const express = require('express');
// create an express application object
const app = express();

// importing hbs (handlebars) module
const hbs = require('hbs');

// importing path module
const path = require('path');

// if environment variable 'PORT' is present use its value otherwise use 5000
const port = process.env.PORT || 5000;

/* creating static, template (views) and partials path by joining system directory name with their
** respective local paths */
const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// built in middleware to parse requests with JSON payloads
app.use(express.json());
// built in middleware to parse requests with urlencoded (strings and arrays) payloads
app.use(express.urlencoded({extended:false}));

// used to server static files (html, css, etc)
app.use(express.static(staticPath));

// sets app to use handlebars template engine
app.set('view engine', 'hbs');
// sets app to use our views (web pages)
app.set('views', templatePath);
// registers our partials (reusable templates) so they can be used 
hbs.registerPartials(partialsPath);

// importing our connect.js module to connect to MongoDB database using Mongoose
require('./db/connect');

// importing Register model
const Register = require('./models/register');

// get route on / path - renders home page
app.get('/', (req, res) => {
    res.render('index');
});

// get route on /login path - renders login page
app.get('/login', (req, res) => {
    res.render('login');
});

// get route on /register path - renders home page
app.get('/register', (req, res) => {
    res.render('register');
});

// post route on /register path - saves data to database
app.post('/register', async (req, res) => {
    try {
        // gets password and confirm password fields from request body
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        // saves to database if password and confirm password fields match
        if (password === cpassword) {
            // creating a new document using Register model where fields are extracted from request body
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,
            });

            // saves the document to database
            const registered = await registerEmployee.save();

            // responds with status 201 (created) and renders home page
            res.status(201).render('index');
        } else {
            // responds with status 400 (bad request) 
            res.status(400).send('passwords are not matching');
        }
    } catch (error) {
        // responds with status 400 (bad request)
        res.status(400).send(error);
    }
});

// starts server and listens the connections on specified host and port 
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
