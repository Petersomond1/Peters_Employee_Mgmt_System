import './index.css'
import Dashboard from './Components/Dashboard'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Department from './Components/Department'
import Profile from './Components/Profile'
import Add_Department from './Components/Add_Department.jsx'
import Add_Employee from './Components/Add_Employee.jsx'
import ViewEmployee from './Components/ViewEmployee'
import EditEmployee from './Components/EditEmployee'
import DeleteEmployee from './Components/DeleteEmployee'
import MainLogin from './Components/mainLogin'
import EmployeeLogin from './Components/EmployeeLogin'
import Employee_Profile from './Components/Employee_Profile.jsx'
import ProtectRoute from './Components/ProtectRoute.jsx'


function App() {



  return (
    <BrowserRouter>
    <Routes>  
      <Route path="/" element={<MainLogin />}></Route>
      <Route path="/employee_login" element={<EmployeeLogin />}></Route>
      <Route path="/employee_profile/:id" element={<Employee_Profile />}></Route>
      <Route path="/adminlogin" element={<Login />}></Route>
      <Route path="/dashboard" element={ <ProtectRoute> <Dashboard /> </ProtectRoute> }>
        <Route path='' element={<Home/>} ></Route>
        <Route path='/dashboard/employee' element={<Employee/>} ></Route>
        <Route path='/dashboard/department' element={<Department/>} ></Route>
        <Route path='/dashboard/profile' element={<Profile/>} ></Route>
        <Route path='/dashboard/add_department' element={<Add_Department/>} ></Route>
        <Route path='/dashboard/add_employee' element={<Add_Employee/>} ></Route>
        <Route path='/dashboard/view_employee/:id' element={<ViewEmployee/>} ></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee/>} ></Route>
        <Route path='/dashboard/delete_employee/:id' element={<DeleteEmployee/>} ></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
