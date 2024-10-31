# Project1 Database
This project is a simple user management system built with Node.js, Express, and MySQL. It allows users to register, view user data, and search users based on specific criteria. This readme for the project will walk you through setting up, deploying, and running the project on your local device. This was developed by Taaseen Khan and Ammar Ahmed.

Prerequisites required: 
Before starting, make sure you have the following installed:

Node.js,
MySQL or Xampp,
Git for cloning

Project Setup
Clone the Repository if you want to run it locally

bash
Copy code
git clone https://github.com/khantaaseen/project1.git
cd project1

Install the following dependencies: Run the following command in the project root directory:

bash
Copy code
npm install
Set Up the Database:

Open MySQL/Xampp and create a new database:
sql
Copy code
CREATE DATABASE users;

bash
Copy code
mysql -u root -p users < schema.sql

Compiling and Running the Project
Start the Server: 
cd into the backend folder
run npm start

By default, the server will run on http://localhost:5050. You can change the port number in index.js if needed but it is not required.

Accessing the Application:

Open a browser and go to http://localhost:5050 to start using the application.
Use the provided HTML and JavaScript files for interacting with the API endpoints. Buttons and input fields are available for searching users by criteria.

API Endpoints
The server has several endpoints for managing and searching user data, use the buttons.
Deployment
To deploy the project to a production environment:

Set Up Environment Variables: If not using XAMPP Replace sensitive information in dbService.js with environment variables, such as MySQL credentials. For example:

javascript
Copy code
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
Configure MySQL for Production: Ensure MySQL is accessible to your server.


Usage
Open the application and interact with the user search and register/signin features.
Use buttons like “Search Users Who Never Signed In” to retrieve specific user data.
Review the console for any error messages or logs while testing.

Additional Notes
Testing: You can write unit tests for each endpoint to ensure functionality before deploying.
Error Handling: Make sure proper error handling is in place for production.
License
This project is licensed under the MIT License and made for CSC 4710 WSU.
