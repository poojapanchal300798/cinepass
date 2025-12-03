  const express = require("express");
  const app = express();
  const cors = require("cors");
  const { Pool } = require("pg");
  const pool = require("./db");

  app.use(cors(  ));
  

  app.use(express.json()); 

  app.post("/login", async (req, res) => {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    try{
      const result= await pool.query("select * from admin_users where username=$1 and password=$2",
        [username, password]);
        console.log("Query result:", result.rows);
    
      if (result.rows.length > 0) {
      res.json({ success: true, message: "Welcome to Cinepass" });
    }
    else {
      res.json({ success: false, message: "Check username and Password" });
    }
    } catch (err) {
      console.error("Error  login:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });