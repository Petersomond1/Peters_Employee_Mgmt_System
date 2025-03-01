import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import { employeeRouter } from './Routes/EmployeeRoute.js';
import jwt from 'jsonwebtoken'; // Import the jwt module
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
     origin: ['http://localhost:5173'],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', employeeRouter);
app.use('/uploads', express.static('uploads'));

const verifyUser = (req, res, next) => {
    if (req.cookies.token) {
        jwt.verify(req.cookies.token, 'jwt_Admin_secret_key, jwt_employee_secret_key', (err, payload) => {
            if (err) {
                return res.json({ Status: false, message: "Unauthorized" });
            } else {
                req.payload = payload;
                next(); // Call the next middleware. This one takes step back to the route that called it (in this case, the route that called it is the route that uses the verifyUser middleware function)
            }
        });
    } else {
        return res.json({ Status: false, message: "Unauthorized" });
    }
}; 

app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.payload.role, id: req.payload.id });

});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});