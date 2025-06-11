const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

const App = express();
App.use(express.json())
App.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

App.use(session({
    secret:'my-secret',
    resave:false,
    saveUninitialized: false,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    }
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password : "",
    database: "qr_attendance"
})

App.post('/', (req,res) => {
    const sql= "SELECT * FROM user_table WHERE email = ?";

    db.query(sql,[req.body.email, req.body.password],(err,data)=>{
        if(data.length > 0){
            const user = data[0]

            bcrypt.compare(req.body.password, user.pass,(err,hash_db_password) => {
                if(hash_db_password){
                    return res.json({message: 'Login Success', first_name: user.first_name})
                }
                else{
                    return res.json({message: 'Login Failed'})
                }
            })
        }
        else{
            return res.json("User not Found")
        }
    })
})

App.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); 

    const sql = "INSERT INTO USER_TABLE (first_name, last_name, email, pass) VALUES(?,?,?,?)";
    db.query(sql, [first_name, last_name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Failed to Register', error: err });
      }
      return res.status(200).json({ status: 'Success', message: 'Registered Successfully' });
    });
});

App.post('/logout',(req,res) =>{
    req.session.destroy(err => {
        if(err){
            return res.status(500).json({message: "Logout Failed"})
        }
        res.json({message: "Logout Success"})
    })
})

App.post('/add-new-project', (req,res) => {

    const {project_name, company} = req.body

    const sql = "INSERT INTO PROJECT_TABLE (project_name,company) VALUES(?,?)";

    db.query(sql,[project_name,company],(err,result) => {
        if(err){
            console.log("Insertion Error", err);
            return res.status(500)
        }
        return res.status(200).json({
            message: "Project added successfully",
        })
    })
})

App.get('/home', (req,res) => {
    const sql = "SELECT * FROM project_table  ";

    db.query(sql,(err,result) => {
        if(err){
            return res.status(500).json({message: "Error"})
        }
        return res.json(result)
    })
})

   
App.listen(8081,() => {
    console.log("Listening in 8081")
})
