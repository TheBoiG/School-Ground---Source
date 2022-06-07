let express = require('express')
let app = express()
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '061003',
    database: 'sggame'
});
let path = require('path')
let bodyParess = require('body-parser')
app.use(bodyParess.urlencoded({extended: false}));
app.use(bodyParess.json())
app.use(express.static(path.join(__dirname)));

app.post('/regit', async function (req, res) {
    connection.query(`select * from user where username = "${req.body.username}"`, (error, results, fields) => {
        if (error) throw error;
        if (results[0]) {
            res.json({
                code: 1003,
                msg: "account exists"
            })
            return;
        }
      
       connection.query(`insert  user () values (null,"${req.body.username}","${req.body.password}","${req.body.tel}")`, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ',);
            res.json({
                code: 1001,
                msg: "User registration succeeded"
            })
        });
    })
})

app.post('/login', (req, res) => {
    console.log(req.body)
    connection.query(`select * from user where username = "${req.body.username}"`, (error, results, fields) => {
        console.log(results)
        if (results[0] && results[0].password == req.body.password) {
            res.json({
                msg: "login successful",
                code: 1001,
            })
        } else {
            res.json({
                msg: "login failed",
                code: 1002
            })
        }

    })
})
app.listen(3002)