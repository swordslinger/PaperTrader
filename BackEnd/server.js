const express = require('express')
const app = express()
const port = 4000 //so it wont collide with other local server
const cors = require('cors');//including cors
const bodyParser = require("body-parser");//allows to intercept body of a http message passed as a post request
const mongoose = require('mongoose');

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//connection to mongo database.
const myConnectionString = 'mongodb+srv://admin:admin@cluster0.u14z7.mongodb.net/users?retryWrites=true&w=majority';
mongoose.connect(myConnectionString, { useNewUrlParser: true });

const Schema = mongoose.Schema;

var usersSchema = new Schema({
    gmail: String,
    password: String
});

var UsersModel = mongoose.model("users", usersSchema);

app.get('/users', (req, res) => {

    // const users = [
    //     {
    //         "Gmail": "Emmet@gmail.com",
    //         "Password": "tuny"
    //     },
    //     {
    //         "Gmail": "ryan@gmail.com",
    //         "Password": "123"
    //     }

    // ];//all hardcoded to object and will be passed to the server

    UsersModel.find((err, data) => { //find all documents in database
        res.json(data);
    })
    // res.status(200).json({
    //     message: "Everything is ok", //passing a string
    //     users: users //object passwed down
    // });
})

app.get('/users/:id', (req, res) => {
    console.log(req.params.id);//logs to console

    UsersModel.findById(req.params.id, (err, data) => {//looks for unique id of each account
        //if data found send it back
        res.json(data);
    })
})



app.post('/users', (req, res) => {//method loads data from the server using a HTTP POST request.
    console.log('Account Recieved!');
    console.log(req.body.gmail);
    console.log(req.body.password);

    UsersModel.create({
        gmail: req.body.gmail,
        password: req.body.password
    });
    res.send('User Added');// so its not duplicated
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})