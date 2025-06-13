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

    const {project_name, company, entity} = req.body

    const sql = "INSERT INTO PROJECT_TABLE (project_name,company,entity) VALUES(?,?,?)";

    db.query(sql,[project_name,company,entity],(err,result) => {
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

App.get('/view-meeting/:project_id', (req, res) => {
    const project_id = req.params.project_id;

    const sql = "SELECT * FROM event_table et JOIN project_table pt ON et.project_id = pt.project_id WHERE et.project_id = ?"

    db.query(sql,[project_id],(err,result) => {
        if(err){
            return res.status(500).json({message: "Error"})
        }
        return res.json(result)
    })
})

App.put('/edit-profile/:user_id', (req,res) => {
    const {user_id} = req.params()

    const {first_name, last_name, email,} = req.body

    const sql = "UPDATE user_table SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?"

    db.query(sql,[first_name, last_name, email], (err, res) => {
        if(err){
            console.error("Error Updating Profile")
            return res.status(500).json({message: 'Failed to update profile'})
        }
        return res.status(200).json({message: 'Successfully update profile'})
    })
})


App.post('/add-new-meeting/:project_id', (req,res) => {
    const { project_id } = req.params;
    const { title, start_date } = req.body;

    const sql = "INSERT INTO event_table (project_id, title, start_date) VALUES(?, ?, ?)";

    db.query(sql, [project_id, title, start_date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'error' });
        }
        return res.status(200).json({ message: 'Meeting created' });
    });
});

App.post("/submit-attendance", (req, res) => {
  const { event_id, attendee_name, attendee_position, attendance_time } = req.body;

  if (!event_id || !attendee_name || !attendee_position || !attendance_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO attendance_table (event_id, attendee_name, attendee_position, attendance_time) VALUES (?, ?, ?, NOW())`;

  db.query(sql, [event_id, attendee_name, attendee_position, attendance_time], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.status(200).json({ message: "Attendance submitted successfully" });
  });
});

App.get("/get-event-details/:event_id", (req, res) => {
  const eventId = req.params.event_id;

  const query = "SELECT title, start_date FROM event_table WHERE event_id = ?";
  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching event details:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(results[0]);
  });
});

   
App.listen(8081,() => {
    console.log("Listening in 8081")
})
