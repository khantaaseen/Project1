// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/

// Fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // One can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});


document.querySelector('#register-btn').onclick = function () {
    const usernameInput = document.querySelector('#register-name-input');
    const passwordInput = document.querySelector('#register-password-input');
    const firstNameInput = document.querySelector('#firstName-input');
    const lastNameInput = document.querySelector('#lastName-input');
    const ageInput = document.querySelector('#age-input');
    const salaryInput = document.querySelector('#salary-input');

    const username = usernameInput.value;
    const password = passwordInput.value;
    const firstname = firstNameInput.value;
    const lastname = lastNameInput.value;
    const age = parseInt(ageInput.value);
    const salary = parseFloat(salaryInput.value);

    // Perform a validation check (optional)
    if (!username || !password || !firstname || !lastname || age < 0 || salary < 0) {
        alert("Please fill out all fields.");
        return;
    }

    console.log(username, password, firstname, lastname, age, salary + "before fetch'ing");
    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            age: age,
            salary: salary
        })
    })
    .then(response => {
        console.log("after fetching");
        return response.json();
    })
    .then(data => {
        insertRowIntoTable(data['data']);
        // Clear input fields after success
        usernameInput.value = "";
        passwordInput.value = "";
        firstNameInput.value = "";
        lastNameInput.value = "";
        ageInput.value = "";
        salaryInput.value = "";
    })
};

// Search by First Name and/or Last Name
document.querySelector('#search-name-btn').onclick = function () {
    const firstNameInput = document.querySelector('#search-firstname-input');
    const lastNameInput = document.querySelector('#search-lastname-input');
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    firstNameInput.value = "";
    lastNameInput.value = "";

    console.log("this is index firstname " + firstName);
    console.log("this is index lastname " + lastName);
    

    if (lastName === "") {
        fetch(`http://localhost:5050/search/firstname/${firstName}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
        return;
    }else if (firstName === "") {
        fetch(`http://localhost:5050/search/lastname/${lastName}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
        return;
    }else{
        fetch(`http://localhost:5050/search/name/${firstName}/${lastName}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
    }
    
}

// Search by User ID
document.querySelector('#search-username-btn').onclick = function () {
    const usernameInput = document.querySelector('#search-username-input');
    const username = usernameInput.value;
    usernameInput.value = "";

    console.log("this is index username " + username);

    fetch(`http://localhost:5050/search/username/${username}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

// Search by Salary Range
document.querySelector('#search-salary-btn').onclick = function () {
    const minSalaryInput = document.querySelector('#search-salary-min-input');
    const maxSalaryInput = document.querySelector('#search-salary-max-input');
    const minSalary = parseFloat(minSalaryInput.value);
    const maxSalary = parseFloat(maxSalaryInput.value);
    minSalaryInput.value = "";
    maxSalaryInput.value = "";

    if (isNaN(minSalary) || isNaN(maxSalary)) {
        alert("Please enter valid salary values.");
        return;
    }

    console.log("this is index salary range " + (maxSalary - minSalary));

    fetch(`http://localhost:5050/search/salary/${minSalary}/${maxSalary}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

// Search by Age Range
document.querySelector('#search-age-btn').onclick = function () {
    const minAgeInput = document.querySelector('#search-age-min-input');
    const maxAgeInput = document.querySelector('#search-age-max-input');
    const minAge = parseInt(minAgeInput.value);
    const maxAge = parseInt(maxAgeInput.value);
    minAgeInput.value = "";
    maxAgeInput.value = "";

    if (isNaN(minAge) || isNaN(maxAge)) {
        alert("Please enter valid age values.");
        return;
    }

    console.log("this is index age range " + (maxAge - minAge));

    fetch(`http://localhost:5050/search/age/${minAge}/${maxAge}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}


// Search Users Registered After Another User
document.querySelector('#search-after-username-btn').onclick = function () {
    const afterUsernameInput = document.querySelector('#search-after-username-input');
    const afterUsername = afterUsernameInput.value;
    afterUsernameInput.value = "";

    fetch(`http://localhost:5050/search/afterUsername/${afterUsername}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

// Search Users Who Never Signed In
document.querySelector('#search-never-signedin-btn').onclick = function () {
    console.log("search never signed in");
    loadHTMLTable([]); 
    fetch('http://localhost:5050/search/neverSignedIn')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => console.error('Error fetching data:', error));
}



// Search Users Registered on the Same Day as Another User
document.querySelector('#search-same-day-btn').onclick = function () {
    const sameDayusernameInput = document.querySelector('#search-same-day-input');
    const sameDayusername = sameDayusernameInput.value;
    sameDayusernameInput.value = "";

    fetch(`http://localhost:5050/search/sameDay/${sameDayusername}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

// Search Users Registered Today
document.querySelector('#return-today-btn').onclick = function () {
    fetch('http://localhost:5050/search/today')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}


let rowToDelete; 
// When the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', function(event){
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.name);   
        rowToDelete = event.target.parentNode.parentNode.rowIndex;    
        debug("delete which one:");
        debug(rowToDelete);
    }   
    if(event.target.className === "edit-row-btn"){
        showEditRowInterface(event.target.dataset.name); // display the edit row interface
    }
});

function deleteRowById(name){
    fetch('http://localhost:5050/delete/' + name, { 
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            document.getElementById("table").deleteRow(rowToDelete);
            // location.reload();
        }
    });
}

let idToUpdate = 0;
function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = ""; // clear this field
    const updateSection = document.querySelector("#update-row");  
    updateSection.hidden = false;
    // We assign the id to the update button as its id attribute value
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate + "");
}

// When the update button on the update interface is clicked
document.querySelector('#update-row-btn').onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: idToUpdate,
            name: updatedNameInput.value
        })
    }) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        } else {
           debug("no update occurs");
        }
    });
}

// This function is used for debugging only, and should be deleted afterwards
function debug(data) {
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    });
}

function insertRowIntoTable(data) {
    debug("index.js: insertRowIntoTable called: ");
    debug(data);

    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";
   
    for(var key in data) { // iterating over each property key of an object data
        if(data.hasOwnProperty(key)) {   // key is a direct property for data
            if(key === 'dateAdded') {  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to JavaScript string
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml +=`<td><button class="delete-row-btn" data-id=${data.username}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.username}>Edit</td>`;
    tableHtml += "</tr>";

    if(isTableData) {
        debug("case 1");
        table.innerHTML = tableHtml;
    } else {
        debug("case 2");
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }

    loadHTMLTable(data);
}

function loadHTMLTable(data) {
    debug("index.js: loadHTMLTable called.");
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({ username, firstname, lastname, salary, age, registerday, signintime }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${username}</td>`;
        tableHtml += `<td>${firstname}</td>`;
        tableHtml += `<td>${lastname}</td>`;
        tableHtml += `<td>${salary}</td>`;
        tableHtml += `<td>${age}</td>`;
        tableHtml += `<td>${new Date(registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${username}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${username}>Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

// Sign In User
document.querySelector("#signIn-btn").onclick = function () {
    const username = document.getElementById('signInUserName-input').value;
    const password = document.getElementById('signInPassword-input').value;

    console.log("index - sign in", username, password);

    fetch('http://localhost:5050/signIn', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username, 
            password: password,
        })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error during sign-in:', error);
        alert('Sign-in failed. Please try again.');
    });
}
