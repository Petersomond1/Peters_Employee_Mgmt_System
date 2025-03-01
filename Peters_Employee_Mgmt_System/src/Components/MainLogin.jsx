// import React, { useEffect } from "react";
// import { RiLoginCircleLine } from "react-icons/ri";
// import "../index.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// const MainLogin = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.defaults.withCredentials = true;
//         axios.get('http://localhost:3000/verify')
//         .then(result => {
//           if (result.data.Status) {
//             console.log('User is logged in')
//             if (result.data.role === 'admin') {
//               navigate('/dashboard');
//             }
//             if (result.data.role === 'employee') {
//               navigate('/employee_profile/'+result.data.id);
//             }
//           } else {
//             console.log('User is not logged in')
//             }
//         })
//         .catch(err => console.log(err))
    
//       })

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//         className="loginDoor"
//       >
//         <div
//           style={{
//             display: "flex",
//             padding: "10px",
//             borderRadius: "15px",
//             height: "10%",
//             width: "15%",
//             border: "5px solid",
//             justifyContent: "center",
//           }}
//           className="loginForm"
//         >
//           <button
//             style={{ fontSize: "20px", color: "blue", width: "90%" }}
//             type="button"
//             onClick={() => navigate("/employee_login")}
//           >
//             <RiLoginCircleLine />
//             <strong>Employee Login</strong>
//           </button>{" "}
//           <br /> <br />
//         </div>
//         <div
//           style={{
//             display: "flex",
//             padding: "5px",
//             borderRadius: "15px",
//             height: "3%",
//             width: "5%",
//             border: "5px solid",
//             justifyContent: "center",
//           }}
//           className="loginForm"
//         >
//           {" "}
//           <button
//             style={{ fontSize: "10px", color: "blue", width: "90%" }}
//             type="button"
//             onClick={() => navigate("/adminlogin")}
//           >
//             {" "}
//             <RiLoginCircleLine />
//             Admin
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLogin;
