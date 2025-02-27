import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employeelist WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (response) {
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_employee_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true, email: email, id: result[0].id });
        } else {
          return res.json({
            loginStatus: false,
            Error: "wrong email or password",
          });
        }
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Email does not exist",
      });
    }
  });
});

router.get("/employee_profile/:id", (req, res) => {
  const sql = "SELECT * FROM employeelist WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, employee: result });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

// router.get("/employee/logout", (req, res) => {
//   if (req.cookies.token) {
//     res.clearCookie("token");
//     return res.json({ Status: true, message: "Logout successful" });
//   } else {
//     return res.json({ Status: false, message: "No active session to logout from" });
//   }
// });



export { router as employeeRouter };
