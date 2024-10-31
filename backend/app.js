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


// Register endpoint
app.post('/insert', (req, res) => {
    console.log("app: insert a row.");

    const { username, password, firstname, lastname, age, salary } = req.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewName(username, password, firstname, lastname, salary, age);

    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
});

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
            res.send('Sucessful sign in!');
        });
    });
});



// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/firstname/:firstname', (request, response) => { // we can debug by URL
    
    const { firstname } = request.params; // Corrected destructuring
    
    console.log("this is app name " + firstname);

    const db = dbService.getDbServiceInstance();

    let result;
    if(firstname === "all" | firstname === "") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByFirstName(firstname); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/lastname/:lastname', (request, response) => { // we can debug by URL
    
    const { lastname } = request.params; // Corrected destructuring
    
    console.log("this is app name " + lastname);

    const db = dbService.getDbServiceInstance();

    let result;
    if(lastname === "all" | lastname === "") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByLastName(lastname); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/name/:firstname/:lastname', (request, response) => {
    const { firstname, lastname } = request.params;
    console.log("this is app name " + firstname);
    console.log("this is app name " + lastname);

    const db = dbService.getDbServiceInstance();

    let result;
    if(firstname === "all" | firstname === "" && lastname === "all" | lastname === "") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(firstname, lastname); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
})


// Search by User ID
app.get('/search/username/:username', (request, response) => {
    const { username } = request.params;

    console.log("this is app username " + username);
    db = dbService.getDbServiceInstance();
    db.searchByUsername(username)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search by Salary Range
app.get('/search/salary/:min/:max', (request, response) => {
    const { min, max } = request.params;

    console.log("this is app salary " + (max - min));
    db = dbService.getDbServiceInstance();
    db.searchBySalaryRange(min, max)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search by Age Range
app.get('/search/age/:min/:max', (request, response) => {
    const { min, max } = request.params;

    console.log("this is app age " + (max - min));
    db = dbService.getDbServiceInstance();
    db.searchByAgeRange(min, max)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search Users Registered After Another User
app.get('/search/afterUsername/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();
    db.searchAfterUsername(username)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search Users Who Never Signed In
app.get('/search/neverSignedIn', (request, response) => {
    db = dbService.getDbServiceInstance();
    db.searchUsersNeverSignedIn()
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search Users Registered on the Same Day as Another User
app.get('/search/sameDay/:username', (request, response) => {

    const { username } = request.params;
    db = dbService.getDbServiceInstance();
    db.searchUsersSameDay(username)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search Users Registered Today
app.get('/search/today', (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getUsersRegisteredToday()
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
    console.log("app: update is called");
    //console.log(request.body);
    const{id, name} = request.body;
    console.log(id);
    console.log(name);
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);

    result.then(data => response.json({success: true}))
    .catch(err => console.log(err)); 

});

// delete service
app.delete('/delete/:id', (request, response) => {
    const {id} = request.params;
    console.log("delete");
    console.log(id);
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result.then(data => response.json({success: true}))
    .catch(err => console.log(err));
})   

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
