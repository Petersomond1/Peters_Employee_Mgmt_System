import React from "react";
import {Link, Outlet} from "react-router-dom";
import "../index.css";
import {CiBank} from "react-icons/ci";
import {FcDepartment} from "react-icons/fc";
import {IoPeople} from "react-icons/io5";
import {BiLogOutCircle} from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleLogout = () => {
        axios.get("http://localhost:3000/auth/logout")
        .then(result => {
            if (result.data.Status) {
                localStorage.removeItem("valid") // This line is not needed it is for protected route so that you can't access the route without being logged in by rewind or refresh a closed page
                navigate("/", { replace: true });
                history.replace("/");
            }
        }).catch(err => console.log(err));
    };
    return (
        <div className="dashboard-container-2">
            <div className="dashboard-container-3 ">
                <div className="navbar-1">
                    {" "}
                    <span>
                        <CiBank />
                        Peters MicroFinance Bank Plc{" "}
                    </span>{" "}
                    <br />{" "}
                    <span>
                        <FcDepartment /> <strong>HR Admin's Dashboard</strong>
                    </span>
                    <span>
                        <i className="fa fa-bars"></i>
                    </span>
                </div>
            

                <div className="dashboard-container-4 ">
                    
                                  <div className="dashboard-container-5">
                                      <Link to="/dashboard">
                                          {" "}
                                          <span>HR Admin's Dashboard</span>
                                      </Link>
                                      <ul>
                                          <li>
                                              <Link to="/dashboard/employee">
                                                  <span>
                                                      <IoPeople />
                                                  </span>
                                                  Manage Employee
                                              </Link>
                                          </li>
                                          <li>
                                              <Link to="/dashboard/department">Company Department</Link>
                                          </li>
                                          <li>
                                              <Link to="/dashboard/profile">Employee Profile</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Salary</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Leave</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Attendance</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Performance</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Training</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Recruitment</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Promotion</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Termination</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Retirement</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Transfer</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Resignation</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Insurance & Benefits</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Employee Payroll</Link>
                                          </li>
                                          <li>
                                              <Link to="/addemployee">Add Employee</Link>
                                          </li>
                                          <li>
                                              <Link to="/viewemployee">View Employee</Link>
                                          </li>
                                          <li>
                                              <Link to="/updateemployee">Update Employee</Link>
                                          </li>
                                          <li>
                                              <Link to="/deleteemployee">Delete Employee</Link>
                                          </li>
                                          <li onClick={handleLogout}>
                                              <Link to="/logout">
                                                  <span>
                                                      <BiLogOutCircle />
                                                  </span>
                                                  Logout
                                              </Link>
                                          </li>
                                      </ul>
                                  </div>  
               <div className="dashboard-main">
                  <Outlet />
              </div>    
              </div>
              
            <div className="footnavbar">
                <footer>Footer</footer>
            </div>
        </div>
    </div>

    );
};


export default Dashboard;
