import React from "react";
import { useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";

const EmployeeLogin = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
      });
    
      const [error, setError] = useState(null);
      const navigate = useNavigate();
    
      axios.defaults.withCredentials = true;
     
      const handleSubmit = (e) => {
        e.preventDefault();
    
        axios
          .post("http://localhost:3000/employee/employee_login", values)
          .then(result => {
            if (result.data.loginStatus) {
                localStorage.setItem("valid", true) // This line is not needed it is for protected route so that you can't access the route without being logged in by rewind or refresh a closed page
                navigate("/employee_profile/"+result.data.id);
            } else {
                console.log("Login Failed");
                setError(result.data.Error + "; Please try again");
            }
        }) 
          .catch(err => console.log(err)) 
      };
  return (
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    }}
    className="loginDoor"
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderRadius: "15px",
        height: "35%",
        width: "35%",
        border: "5px solid",
        justifyContent: "center",
      }}
      className="loginForm"
    >
    {error && (
        <div className="button-danger-display">
            {error}
        </div>
    )}
      
      <form style={{justifyContent:'center', display:'block', flexDirection:'column', marginTop:'-25px'}} onSubmit={handleSubmit}>
        <h3><span><TbLogin2 /></span> Employee Login</h3>
        <div>
          <label htmlFor="email">
            <strong>Email:</strong>
          <input
            type="email"
            name="email"
            autoComplete="off"
            placeholder="Enter Your Email Here"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            className="login_email_input"
            style={{ formControl: "plaintext", width: "80%", margin: "5px"}}
          />
           </label>
        </div>
        <div>
          <label htmlFor="password">
            <strong>Password:</strong>
          <input
            onChange={(e) =>
              setValues({ ...values, password: e.target.value })
            }
            className="login_password_input"
            style={{width: "80%", margin: "5px", formControl: "plaintext" }}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Enter Your Password Here"
          />
          </label>
        </div>
        <button 
            type="submit"
            className="login_submit_btn"
            style={{ fontSize: "20px", color: "blue", width: "50%", justifyContent:'center', marginLeft:'22%' }}
        >
            Log in
        </button>
        <div style={{ marginBottom: "1px" }}>
          <input
            type="checkbox"
            name="tick"
            id="tick"
          />
          <label htmlFor="remember" className="form-label">
            {" "}
            I agree to the terms & conditions of use of this site as an employee
          </label>
        </div>
      </form>
    </div>
  </div>
  )
}

export default EmployeeLogin