const connection = require('./database/connection');
const express = require('express');
const cors = require('cors');

console.log('Welcome to API Rest uran-App');

connection();

const app = express();
const port = 3900;

app.use(cors());

//Parse body data from content-typ: application/json to json
app.use(express.json());
// Parse body data from form-url-encode data to json
app.use(express.urlencoded({extended:true}));


const CredentialsRoutes = require('./routes/credentials');
const UsersRoutes = require('./routes/users');
app.use('/api/credentials', CredentialsRoutes);
app.use('/api/users', UsersRoutes);

//Test route to check if everything is working ok
app.get('/test-route', (req, res) => {
    return res.status(200).json({
        id: 1,
        name: 'jprioses', 
        web: 'wudevs'
    })
});

//Get server to listen 
app.listen(port, () => {
    console.log('Server listening in port ' + port)
});