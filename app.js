//setting packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//data holders

var query = "";
var id = 0;
var names = [];
var phones = [];

//connecting database
var connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", //mysql root password here
    database: "phonebook"
});

connect.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected successfully");
});

//handling get requests
app.get("/", function (req, res) {
    res.render("login.ejs", {});
});
app.get("/logout", function (req, res) {
    id = 0;
    res.render("login.ejs");
});

app.get("/contacts", function (req, res) {
    if (id == 0) {
        res.redirect("/");
    } else {
        query = "select name,phone from contacts where ID=" + id;
        connect.query(query, function (err, result) {
            if (err) throw err;
            names = [];
            phones = [];
            for (let i = 0; i < result.length; i++) {
                names.push(result[i].name);
                phones.push(result[i].phone);
            }
        });

        setTimeout(function () {
            res.render("contacts.ejs", {
                phones: phones,
                names: names
            });
        }, 300);


    }

})
app.get("/register", function (req, res) {
    res.render("registration.ejs", {});
});

//handling post requests
app.post("/login", function (req, res) {
    query = "select ID,password from user_data where username='" + req.body.username + "'";

    connect.query(query, function (err, result) {
        if (err) throw err;
        id = result[0].ID;
        if (req.body.password == result[0].password) {
            res.redirect("/contacts");
        } else {
            res.redirect("/");
        }

    });

});

app.post("/addContact", function (req, res) {
    if (req.body.what == "add") {
        query = "insert into contacts values(" + id + ",'" + req.body.name + "','" + req.body.phone + "')";
        connect.query(query, function (err, result) {
            if (err) throw err;
            res.redirect("/contacts");
        });
    } else {
        query = "delete from contacts where ID=" + id + " and name='" + names[req.body.itempos] + "'";
        connect.query(query, function (err, result) {
            if (err) throw err;
            res.redirect("/contacts");
        });
    }
});
app.post("/register", function (req, res) {
    query = "insert into user_data (username,password) values('" + req.body.username + "','" + req.body.password + "')";
    connect.query(query, function (err, result) {
        if (err) throw err;
        res.redirect("/");
    });
})

app.post("/update", function (req, res) {
    query = "update contacts set phone='" + req.body.updateto + "' where ID=" + id + " and name='" + names[req.body.toupdate] + "'";
    connect.query(query, function (err, result) {
        if (err) throw err;
        res.redirect("/contacts");
    });

});
//starting server on port 3000

app.listen(3000, function () {
    console.log("server is started on port 3000");
});