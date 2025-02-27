import React from "react";
import { useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";

const Login = () => {
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
      .post("http://localhost:3000/auth/adminlogin", values)
      .then(result => {
        if (result.data.loginStatus === true) {
          localStorage.setItem("valid", true) // This line is not needed it is for protected route so that you can't access the route without being logged in by rewind or refresh a closed page
            navigate("/dashboard");
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
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      className="loginDoor"
    >
      <div
        style={{
          padding: "2px",
          borderRadius: "0",
          height: "20%",
          width: "45%",
          border: "1px solid",
        }}
        className="loginForm"
      >
        <div className="button-danger-display">
            {error && error}
        </div>
        <h3><span><TbLogin2 /></span> Login Page</h3>
        <form onSubmit={handleSubmit}>
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
              style={{ formControl: "plaintext" }}
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
              style={{ borderRadius: "0%", formControl: "plaintext" }}
              type="password"
              name="password"
              autoComplete="off"
              placeholder="Enter Your Password Here"
            />
            </label>
          </div>
          <button className="login_submit_btn">Log in</button>
          <div style={{ marginBottom: "1px" }}>
            <input
              type="checkbox"
              name="tick"
              id="tick"
              style={{ marginInlineStart: "2px" }}
            />
            <label htmlFor="remember" className="form-label">
              {" "}
              I agree to the terms & conditions of this site
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
