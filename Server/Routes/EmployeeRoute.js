import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  let sql;
  if (role === "admin") {
    sql = "SELECT * FROM admin WHERE email = ?";
  } else if (role === "employee") {
    sql = "SELECT * FROM employeelist WHERE email = ?";
  } else {
    return res.json({ loginStatus: false, Error: "Invalid role" });
  }

  con.query(sql, [email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const user = result[0];
      if (!user.hashedPassword) {
        // First-time login
        if (password === user.password) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          const updateSql = role === "admin" ? "UPDATE admin SET password = ?, hashedPassword = ? WHERE email = ?" : "UPDATE employeelist SET password = ?, hashedPassword = ? WHERE email = ?";
          con.query(updateSql, [hashedPassword, hashedPassword, email], (err, updateResult) => {
            if (err) return res.json({ loginStatus: false, Error: "Query error" });
            const token = jwt.sign(
              { role: role, email: email, id: user.id },
              role === "admin" ? "jwt_Admin_secret_key" : "jwt_employee_secret_key",
              { expiresIn: "1d" }
            );
            res.cookie("token", token);
            return res.json({ loginStatus: true, email: email, id: user.id, role: role, firstTime: true });
          });
        } else {
          return res.json({ loginStatus: false, Error: "wrong email or password" });
        }
      } else {
        // Regular login
        bcrypt.compare(password, user.password, (err, response) => {
          if (err) return res.json({ loginStatus: false, Error: "Query error" });
          if (response) {
            const token = jwt.sign(
              { role: role, email: email, id: user.id },
              role === "admin" ? "jwt_Admin_secret_key" : "jwt_employee_secret_key",
              { expiresIn: "1d" }
            );
            res.cookie("token", token);
            return res.json({ loginStatus: true, email: email, id: user.id, role: role });
          } else {
            return res.json({ loginStatus: false, Error: "wrong email or password" });
          }
        });
      }
    } else {
      return res.json({ loginStatus: false, Error: "Email does not exist" });
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

export { router as employeeRouter };