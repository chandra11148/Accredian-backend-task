const express = require("express");
const mysql = require('mysql2');


const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '7033109802@'
  });
app.use(express.urlencoded({extended:true}));
let port =8080;
app.listen(port,()=>{
    console.log("listening...");
});

app.post("/register", (req, res) => {
    console.log(`GET request to "/auth/register" received for user}`);
    let {username,email,password}=req.body;
    let q = `INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)`;
    let user =[id,username,email,password];
    let qFind =`SELECT * FROM users WHERE username=${username} OR email=${email}`;
    connection.query(qFind, (err, user) => {
      if (err) {
        return handleError(res, err);
      }
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Username/Email already exists",
        });
      }
      // if (req.body.username.length < 6 || req.body.username.length > 32) {
      //     return res.status(400).json({
      //         success: false,
      //         message:
      //             'Username must be between 6 and 32 characters in length'
      //     });
      // }
      // if (req.body.password.length < 6 || req.body.password.length > 32) {
      //     return res.status(400).json({
      //         success: false,
      //         message:
      //             'Password must be between 6 and 32 characters in length'
      //     });
      // }
      
      try{
        connection.query(q,user,(err,result)=>{
            console.log(`Registered user: ${req.body.username}`);
        });
    }catch(err){
        res.send(err);
    }
      
  
      return res.status(201).json({
        success: true,
      });
    });
  });

  app.post("/login", (req, res) => {
    console.log(`POST request to "/auth/login" received`);
    let {username,email,password}=req.body;

    let qFind =`SELECT * FROM users WHERE username=${username} OR email=${email}`;
    let user =[id,username,email,password];

    connection.query(qFind, (err, user) => {
      if (err) {
        return handleError(res, err);
      }
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Username does not exist",
        });
      }
      if (user.password !== sha256(req.body.password)) {
        return res.status(400).json({
          success: false,
          message: "Password is incorrect",
        });
      }
      const token = jwt.sign({ username: user.username }, config.jwtSecret, {
        expiresIn: "6h",
      });
  
      console.log(`Logged in as user: ${req.body.username}`);
  
      return res.status(201).json({
        success: true,
        token: token,
        username: user.username,
        
      });
    });
  });
  
  const sha256 = (input) =>
    crypto.createHash("sha256").update(input, "utf8").digest("hex");