const express = require("express");
const router = express.Router();

const { loginController } = require("../controllers/authController");

// LOGIN ROUTE
router.post("/login", loginController);

module.exports = router;
