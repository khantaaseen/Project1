// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});

//register
app.post('/register', (req, res) => {
    const { userName, password, firstName, lastName, age, salary } = req.body;
    const dayofregistration = new Date().toISOString().slice(0, 10); // registration date
    const query = 'INSERT INTO Users (userName, password, firstName, lastname, age, salary, dayofregistration) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userName, password, firstName, lastName, age, salary,  dayofregistration], (err, result) => {
        if (err) {
            return res.status(500).send('There was an error in the registration process.');}
        res.send('Successful registration!');});});
// sign in
app.post('/signin', (req, res) => {
    const { userName, password } = req.body;
    const signInTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // time and date
    const query1 = 'SELECT * FROM Users WHERE userName = ? AND password = ?';
    // query code
    db.query(query1, [userName, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Error, wrong credentials');}

        // Update sign-in time query
        const updatequery = 'UPDATE Users SET signInTime = ? WHERE userName = ?';
        db.query(updatequery, [signInTime, userName], (updateErr) => { 
            if (updateErr) return res.status(500).send('There was an error in updating the sign in time.');
            res.send('Sucessful sign in!');});});});

// search query
app.get('/search', (req, res) => {
    const { firstName, lastName } = req.query;
    let query = 'SELECT * FROM Users WHERE ';
    const params = [];
    if (firstName) {
        query += 'firstName LIKE ? ';
        params.push(`%${firstName}%`);}
    if (lastName) {
        if (firstName) query += 'AND ';
        query += 'lastName LIKE ?';
        params.push(`%${lastName}%`);}
    // error handling 
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).send('There was an error searching for users');
        res.json(results);});});

// search by ID
app.get('/searchById/:userName', (req, res) => {
    const userName = req.params.userName;
    const query = 'SELECT * FROM Users WHERE userName = ?';
    // error handling
    db.query(query, [userName], (err, results) => {
        if (err) return res.status(500).send('Could not find user through userid');
        res.json(results);});});

// search by salary
app.get('/searchBySalary', (req, res) => {
    const { minSalary, maxSalary } = req.query;
    const query = 'SELECT * FROM Users WHERE salary BETWEEN ? AND ?';
    // error handling
    db.query(query, [minSalary, maxSalary], (err, results) => {
        if (err) return res.status(500).send('There was an error searching for users by salary');
        res.json(results);});});
// search by age
app.get('/searchByAge', (req, res) => {
    const { minAge, maxAge } = req.query;
    const query = 'SELECT * FROM Users WHERE age BETWEEN ? AND ?';
    // error handling
    db.query(query, [minAge, maxAge], (err, results) => {
        if (err) return res.status(500).send('There was an error searching by age');
        res.json(results);});});
// search for users who signed in after john
app.get('/searchRegisteredAfter/:userName', (req, res) => {
    const userName = req.params.userName;
    const getjohn = 'SELECT dayofregistration FROM Users WHERE userName = ?';
    
    db.query(getjohn, [userName], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('there are no users that match this search parameter');
        const johnDate = result[0].dayofregistration;
        const query = 'SELECT * FROM Users WHERE dayofregistration > ?';
        // error handling
        db.query(query, [johnDate], (err, results) => {
            if (err) return res.status(500).send('Error, Could not find users for users who registered after John');
            res.json(results); });});});
// no signin search   
app.get('/searchNeverSignedIn', (req, res) => {
    const query = 'SELECT * FROM Users WHERE signInTime IS NULL';
    // error handling
    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Could not find users who never signed in');
        res.json(results);});});
// search for users who registered on the same day as john
app.get('/searchRegisteredSameDay/:userName', (req, res) => {
    const samedaysignin = req.params.samedaysignin;
    const getjohn = 'SELECT dayofrgistration FROM Users WHERE userName = ?';
    
    db.query(getjohn, [samedaysignin], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('There are no users who registered at the same time as the given parameter');
        
        const johnDate = result[0].dayofregistration;
        const query = 'SELECT * FROM Users WHERE dayofregistration = ?';
        // error handling
        db.query(query, [johnDate], (err, results) => {
            if (err) return res.status(500).send('There was an error searching for users who registered on the same day as John');
            res.json(results); }); });});
// register today search
app.get('/searchRegisteredToday', (req, res) => {
    const date = new Date().toISOString().slice(0, 10); 
    const query = 'SELECT * FROM Users WHERE dayofregistration = ?';
    //error handling
    db.query(query, [date], (err, results) => {
        if (err) return res.status(500).send('Could not find users who registered today');
        res.json(results);});});









// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
