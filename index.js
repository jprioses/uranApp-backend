const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

const { errorResponse } = require("./utils/response");
const CredentialsRoutes = require("./routes/credentials");
const UsersRoutes = require("./routes/users");
const NotificationsRoutes = require('./routes/notifications');
const CommentsRoutes = require('./routes/comments');

console.log("Welcome to API Rest uran-App");

connection();

const app = express();
const port = 3900;

app.use(cors());

//Parse body data from content-typ: application/json to json
app.use(express.json());
// Parse body data from form-url-encode data to json
app.use(express.urlencoded({ extended: true }));

app.use("/api/credentials", CredentialsRoutes);
app.use("/api/users", UsersRoutes);
app.use("/api/notifications", NotificationsRoutes);
app.use("/api/comments", CommentsRoutes);

//This middleware with error as parameter is the error handler function wich express is going to use
app.use((err, req, res, next) => {
  if (err.name == 'CastError') {
    err.message = "Couldn't find document"
    err.statusCode = 500
  }
  if (!err.statusCode) err.message = "Error while connecting to database";
  errorResponse(res, err.statusCode || 500, err.message);
});

//Get server to listen
app.listen(port, () => {
  console.log("Server listening in port " + port);
});

//TODOS
//1 --> Feed notificacitions and get only last 10 and get all -<<<<<<<<< Done
//2 --> Create history log database for eliminated and updated data -<<<<<<<<< Done
//3 --> Upload images -<<<<<<<<< Done
//4 --> Create comments per user and get them -<<<<<<<<< Done
//5 --> Create credentials to godfathers and leaders users. -<<<<<<<<< Done
//6 --> Change users leader and godfather refs -<<<<<<<<< Done
//7 --> automatically add lonely users to campaing user -<<<<<<<<< Done
//8 --> Feed polling places data