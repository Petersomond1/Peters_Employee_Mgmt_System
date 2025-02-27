import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../index.css'


const Department = () => {

    const [department, setDepartment] = useState([
        {id: '', name: '', head: '', description: '', status: ''}
    ])

    useEffect(() => {
        axios.get('http://localhost:3000/auth/department')
        .then(result => {
           if (result.data.Status) {
               setDepartment(result.data.department)
           } else {
                alert(result.data.Error);
              }
        }).catch(err => console.log(err));
    }, [])



  return (
    <div>
        <div>
            <h3>Department List</h3>
        </div>
        <div>
           <button> <strong><Link to="/dashboard/add_department" style={{color:'green'}} >Add Department</Link></strong></button>
         </div>
         <div style={{marginTop:'3px'}}>
         <table className='table'>
            <thead>
                <tr>
                    <th>Department ID</th>
                    <th>Department Name</th>
                    <th>Department Head</th>
                    <th>Department Description</th>
                    <th>Department Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {department.map((department, id) => (
                    <tr key={id}>
                        <td>{department.id}</td>
                        <td>{department.name}</td>
                        <td>{department.head}</td>
                        <td>{department.description}</td>
                        <td>{department.status}</td>
                        <td>
                            <button>View</button>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
         </div>
    </div>
  )
}

export default Department