import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Employee = (employeelist) => {
  const [employee, setEmployee] = useState([
    { name: '', email: '', password: '', position: '', department: '', salary: '', address: '', employee_Image: '', employment_status: '', employment_date: '', department_id: ''}
  ])
  const navigate = useNavigate();
   useEffect(() => {
    axios.get("http://localhost:3000/auth/employee")
    .then(result => {
      if (result.data.Status) {
          setEmployee(result.data.employee)
      } else {
           alert(result.data.Error);
         }
   }).catch(err => console.log(err));
}, [])

const handleDelete = async (id) => {
  await axios.delete(`http://localhost:3000/auth/delete_employee/${id}`)
  .then(result => {
      if (result.data.Status) {
          alert(result.data.Status);
          window.location.reload();
      } else {
          alert(result.data.Error);
      }
  }).catch(err => console.log(err));
}

  return (
    <div>
    <div>
        <h3>Employee List</h3>
    </div>
    <div>
       <button className='add-employee'> <strong><Link to="/dashboard/add_employee" style={{color:'green'}} >Add Employee</Link></strong></button>
     </div>
       <table>
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Employee Email</th>
                <th>Assigned Password</th>
                <th>Position/Rank</th>
                <th>Department </th>
                <th>Salary/Rate</th>
                <th>Address/Branch</th>
                <th>Select Image</th>
                <th>Employment_status</th>
                <th>Employment_date</th>
                <th>department_id</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
        {employee.map((employee, id) => (
          <tr key={id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.password}</td>
            <td>{employee.position}</td>
            <td>{employee.department}</td>
            <td>{employee.salary}</td>
            <td>{employee.address}</td>
            {employee.employee_Image && <td><img src={`http://localhost:3000/${employee.employee_Image}`} className='employee_image' alt="" /></td>}
            <td>{employee.employment_status}</td>
            <td>{employee.employment_date}</td>
            <td>{employee.department_id}</td>
            <td>
            <button className='view-button'><Link to={`/dashboard/view_employee/`+employee.id}>View</Link></button>
            <button className='edit-button'><Link to={`/dashboard/edit_employee/`+employee.id}>Edit</Link></button>
            <button className='delete-button' onClick={() => handleDelete(employee.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
     </table>  
</div>
)
}

export default Employee
