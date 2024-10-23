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

// // When the addBtn is clicked
// const addBtn = document.querySelector('#add-name-btn');
// addBtn.onclick = function (){
//     const nameInput = document.querySelector('#name-input');
//     const name = nameInput.value;
//     nameInput.value = "";

//     fetch('http://localhost:5050/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({name: name})
//     })
//     .then(response => response.json())
//     .then(data => insertRowIntoTable(data['data']));
// }

// When the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete; 

// When the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', function(event){
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);   
        rowToDelete = event.target.parentNode.parentNode.rowIndex;    
        debug("delete which one:");
        debug(rowToDelete);
    }   
    if(event.target.className === "edit-row-btn"){
        showEditRowInterface(event.target.dataset.id); // display the edit row interface
    }
});

function deleteRowById(id){
    fetch('http://localhost:5050/delete/' + id, { 
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
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
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

    tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;
    tableHtml += "</tr>";

    if(isTableData) {
        debug("case 1");
        table.innerHTML = tableHtml;
    } else {
        debug("case 2");
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    debug("index.js: loadHTMLTable called.");
    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml +=`<td>${id}</td>`;
        tableHtml +=`<td>${name}</td>`;
        tableHtml +=`<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml +=`<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

const addBtn = document.querySelector('#register-btn');
addBtn.onclick = function () {
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
    const age = parseInt(ageInput.value); // assuming age is a number
    const salary = parseFloat(salaryInput.value); // assuming salary is a decimal number

    // Clear the input fields after getting the values
    usernameInput.value = "";
    passwordInput.value = "";
    firstNameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";
    salaryInput.value = "";

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
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}



// Sign In User
if (signInBtn) {
    signInBtn.addEventListener('click', () => {
        const username = document.getElementById('userName-input').value;
        const password = document.getElementById('password-input').value;

        fetch('http://localhost:5050/signIn', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User signed in successfully!');
                // Redirect or perform some action after successful sign-in
            } else {
                alert('Sign-in failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error during sign-in:', error);
            alert('Sign-in failed. Please try again.');
        });
    });
}
