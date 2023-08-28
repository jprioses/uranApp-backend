const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
const { errorResponse } = require("./utils/response");

console.log("Welcome to API Rest uran-App");

connection();

const app = express();
const port = 3900;

app.use(cors());

//Parse body data from content-typ: application/json to json
app.use(express.json());
// Parse body data from form-url-encode data to json
app.use(express.urlencoded({ extended: true }));

const CredentialsRoutes = require("./routes/credentials");
const UsersRoutes = require("./routes/users");
const ClientError = require("./utils/errors");
app.use("/api/credentials", CredentialsRoutes);
app.use("/api/users", UsersRoutes);

//This middleware with error as parameter is the error handler function wich express is going to use
app.use((err, req, res, next) => {
  if (!err.statusCode) err.message = 'Error while connecting to database';
  errorResponse(res, err.statusCode || 500, err.message) ;
});

//Get server to listen
app.listen(port, () => {
  console.log("Server listening in port " + port);
});

//TODOS
//1 --> Feed notificacitions
//2 --> Create history log database for eliminated and updated data
//3 --> Upload images
//4 --> Create comments per user and get them
