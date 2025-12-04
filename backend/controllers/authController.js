const pool = require("../db"); // PostgreSQL connection

const loginController = async (req, res) => {
  const { username, password } = req.body;

  console.log("LOGIN REQUEST:", username, password);

  try {
    // Query admin_users table
   const result = await pool.query(
  "SELECT * FROM admin_users WHERE username = $1 OR email = $1",
  [username]
);


    // If no user found
    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];

    // Compare passwords (plain text for now)
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Success
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { loginController };
