import React, { useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "employee", // Default role
  });

  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false); // State to manage active/inactive state
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/employee/login", values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          if (result.data.firstTime) {
            alert("This is your first time logging in. Please change your password.");
          }
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else if (result.data.role === "employee") {
            navigate("/employee_profile/" + result.data.id);
          }
        } else {
          console.log("Login Failed");
          setError(result.data.Error + "; Please try again");
        }
      })
      .catch((err) => console.log(err));
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
      {!isActive ? (
        <button
          onClick={() => setIsActive(true)}
          style={{
            fontSize: "20px",
            color: "blue",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "2px solid blue",
            cursor: "pointer",
          }}
        >
          Click to start login
        </button>
      ) : (
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
          {error && <div className="button-danger-display">{error}</div>}

          <form
            style={{
              justifyContent: "center",
              display: "block",
              flexDirection: "column",
              marginTop: "-25px",
            }}
            onSubmit={handleSubmit}
          >
            <h3>
              <span>
                <TbLogin2 />
              </span>{" "}
              Login
            </h3>
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
                  style={{ formControl: "plaintext", width: "80%", margin: "5px" }}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                <strong>Password:</strong>
                <input
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  className="login_password_input"
                  style={{ width: "80%", margin: "5px", formControl: "plaintext" }}
                  type="password"
                  name="password"
                  autoComplete="off"
                  placeholder="Enter Your Password Here"
                />
              </label>
            </div>
            <div>
              <label htmlFor="role">
                <strong>Role:</strong>
                <select
                  name="role"
                  onChange={(e) => setValues({ ...values, role: e.target.value })}
                  value={values.role}
                  style={{ width: "80%", margin: "5px" }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="login_submit_btn"
              style={{
                fontSize: "20px",
                color: "blue",
                width: "50%",
                justifyContent: "center",
                marginLeft: "22%",
              }}
            >
              Log in
            </button>
            <div style={{ marginBottom: "1px" }}>
              <input type="checkbox" name="tick" id="tick" />
              <label htmlFor="remember" className="form-label">
                {" "}
                I agree to the terms & conditions of use of this site
              </label>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeLogin;