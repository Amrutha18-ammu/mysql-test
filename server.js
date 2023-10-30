const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

const port = process.env.port || 4000;
const app = express();
app.use(express.json());
var connection = mysql.createConnection({
    host : 'sql9.freemysqlhosting.net',
    user : 'sql9654125',
    password : 'WrJQSwnkv7',
    database: 'sql9654125',
});
app.post('/api/signup', (req, res) =>{
    const  username= req.body.username;
    const  password = req.body.password;
    if (!username || !password) {
        res.status(400).send("username and password are required")
        return
    }
    const pwd = encryptPassword(password);
    const date = transformDate(new Date());
    connection.connect();
    connection.query('Insert INTO users (username, password, signupdate) VALUES ( ?, ?, ?)',[username, pwd, date], function (error, results, fields) {
       connection.end();
        if (error)  {
            console.log("user creation failed" + error.message)
            if (error.code == "ER_DUP_ENTRY") {
                res.status(400).send("username already exists")
            } else {
                res.status(400).send("Something went wrong")
            }
            
        } else  {
            console.log("user is created")
            res.status(200).send("user successfully created")
        }
       
    });
});
app.get('/budgets', async (req, res) =>{
   connection.connect();
   connection.query('SELECT * From budget', function (error, results, fields) {
      connection.end();
       if (error) throw error;
       res.json(results);
   });

});


app.listen(port, () => {
     console.log('Server on port ${port}');
});

function encryptPassword(password){ 
const hash = crypto.createHash('sha256').update(password).digest('hex'); 
return hash;
}

function transformDate(date){
    return date.getYear() + "-"+ date.getMonth() + "-" + date.getDay()
}