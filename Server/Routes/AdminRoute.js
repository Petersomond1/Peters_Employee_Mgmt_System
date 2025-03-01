import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import multer from 'multer';
import path from 'path';




const router = express.Router();

// router.post('/add_admin', (req, res) => {
//     const { name, email, password, role } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const sql = 'INSERT INTO admin (name, email, password, hashedPassword, role) VALUES (?, ?, ?, ?, ?)';
//     con.query(sql, [name, email, hashedPassword, hashedPassword, role], (err, result) => {
//         if (err) return res.json({ Status: false, Error: "Query error" });
//         return res.json({ Status: true });
//     });
// });

router.post('/add_admin', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)';
    con.query(sql, [name, email, hashedPassword, role], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" });
        return res.json({ Status: true });
    });
});


// router.post('/adminlogin', (req, res) => {
//     const sql = 'SELECT * FROM admin WHERE email = ?';
//     con.query(sql, [req.body.email], (err, result) => {
//         if (err) return res.json({ loginStatus: false, Error: "Query error" });
//         if (result.length > 0) {
//             const isPasswordValid = bcrypt.compareSync(req.body.password, result[0].password);
//             if (isPasswordValid) {
//                 const email = result[0].email;
//                 const token = jwt.sign(
//                     { role: "admin", email: email, id: result[0].id },
//                     "jwt_Admin_secret_key",
//                     { expiresIn: "1d" }
//                 );
//                 res.cookie("token", token);
//                 return res.json({ loginStatus: true });
//             } else {
//                 return res.json({ loginStatus: false, Error: "wrong email or password" });
//             }
//         } else {
//             return res.json({ loginStatus: false, Error: "wrong email or password" });
//         }
//     });
// });


router.get('/department', (req, res) => {
    const sql = 'SELECT * FROM department';
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" });
        return res.json({ Status: true, department: result });
    })
});

router.post('/add_Department', (req, res) => {
    const sql = 'INSERT INTO department (name, head, description, status) VALUES (?, ?, ?, ?)';
    const department = [req.body.name, req.body.head, req.body.description, req.body.status];
    con.query(sql, department, (err, result) => {
                        if (err) return res.json({ Status: false, Error: "Query error" });
                        return res.json({Status: true });
                    })
    });

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
            //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage: storage });

    router.post('/add_employee', upload.single('employee_Image'), (req, res) => {
        const sql = 'INSERT INTO employeelist (name, email, password, position, department, salary, address, employee_Image, employment_status, employment_date, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
            if (err) return res.json({ Status: false, Error: "Hashing error" });
    
            // let filePath = req.file.originalname.replace('uploads/', ''); // This should be the filename
            let filePath = req.file.originalname; // This should be the filename
            // let filePath = req.file.path; // This should be the path where the file is stored
            const employee = [req.body.name, req.body.email, hash, req.body.position, req.body.department, req.body.salary, req.body.address, filePath, req.body.employment_status, req.body.employment_date, req.body.department_id];
            con.query(sql, employee, (err, result) => {
                if (err) return res.json({ Status: false, Error: "Query error" + err});
                return res.json({ Status: true });
            })
            
        });
    });
    
    router.get('/employee', (req, res) => {
        const sql = 'SELECT * FROM employeelist';
        con.query(sql, (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true, employee: result });
        });
    });

    router.get('/employee/:id', (req, res) => {
        const sql = 'SELECT * FROM employeelist WHERE id = ?';
        con.query(sql, [req.params.id], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true, employee: result[0] });
        });
    });

    router.put('/edit_employee/:id', (req, res) => {
        const sql = 'UPDATE employeelist SET name = ?, email = ?, position = ?, department = ?, salary = ?, address = ?, employment_status = ?, employment_date = ?, department_id = ? WHERE id = ?';
        const employee = [req.body.name, req.body.email, req.body.position, req.body.department, req.body.salary, req.body.address, req.body.employment_status, req.body.employment_date, req.body.department_id, req.params.id];
        con.query(sql, employee, (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true });
        });
    }); 

        router.delete('/delete_employee/:id', (req, res) => {
            const sql = 'DELETE FROM employeelist WHERE id = ?';
            con.query(sql, [req.params.id], (err, result) => {
                if (err) return res.json({ Status: false, Error: "Query error" });
                return res.json({ Status: true });
            });
        });

        router.get('/summaryCount', (req, res) => {
            const sql = 'SELECT COUNT(id) as admin FROM admin';
            const sql2 = 'SELECT SUM(salary) as salary FROM employeelist';
            const sql3 = 'SELECT COUNT(id) as employees FROM employeelist';

            con.query(sql, (err, result) => {
                if (err) return res.json({ Status: false, Error: "Query error" });
                const adminCount = result[0].admin;

                con.query(sql2, (err, result2) => {
                    if (err) return res.json({ Status: false, Error: "Query error" });
                    const totalSalary = result2[0].salary;

                    con.query(sql3, (err, result3) => {
                        if (err) return res.json({ Status: false, Error: "Query error" });
                        const employeeCount = result3[0].employees;

                        return res.json({ Status: true, admin: adminCount, salary: totalSalary, employees: employeeCount });
                    });
                });
            });
        });

        router.get('/adminDetails', (req, res) => {
            const sql = 'SELECT * FROM admin';
            con.query(sql, (err, result) => {
                if (err) return res.json({ Status: false, Error: "Query error" });
                return res.json({ Status: true, admins: result });
            });
        });

        router.get('/logout', (req, res) => {
            res.clearCookie('token');
            return res.json({ Status: true });
        });


    export { router as adminRouter };
