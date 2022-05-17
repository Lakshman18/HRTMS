import React, {useState, useEffect, useContext} from 'react';
import Breadcrumb from '../../common/Breadcrumb'
import * as IoIcons from 'react-icons/io';
import { UserContext } from "../../Context";
import { IconContext } from 'react-icons/lib';
import {toast} from 'react-toastify'
import { Button, Modal, Form, Badge } from 'react-bootstrap';

import { useNavigate, useLocation} from 'react-router-dom';

const EditProfile = () => {

    const [ManagerData, setManagerData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [designationData, setDesignationData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentDesignationData, setDepartmentDesignationData] = useState([]);
    const [user, token, userRole] = useContext(UserContext);
    const axios = require('axios');
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [manager, setManager] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        getData()
        setSelectedRecord(location.state[0])   
         
        setDepartment(location.state[0].department)  
        setDesignation(location.state[0].designation)  
        setManager(location.state[0].manager)  
        setRole(location.state[0].userRole)
        
    }, [])

    const getData = async(e) =>{
        try{
            const response1 = await axios.get(process.env.REACT_APP_APIURL + '/employee/viewAllEmp', { params: { token: token } });
            const response3 = await axios.get(process.env.REACT_APP_APIURL + '/employee/roles', { params: { token: token } });
            const response4 = await axios.get(process.env.REACT_APP_APIURL + '/designation', { params: { token: token } });
            const response5 = await axios.get(process.env.REACT_APP_APIURL + '/department', { params: { token: token } });
            if(response1.data.status_code===200 ||response3.data.status_code===200 ||response4.data.status_code===200 ||response5.data.status_code===200){
                // console.log(response1.data.message.filter(item => item.isActive==true && (item.userRole_name==="manager" || item.userRole_name==="admin") ))
                // setManagerData(response1.data.message)
                setManagerData(response1.data.message.filter(item => item.isActive==true && (item.userRole_name==="manager" || item.userRole_name==="admin") ))
                setRoleData(response3.data.message.filter(item => item.isActive==true))
                setDesignationData(response4.data.message.filter(item => item.isActive==true))
                setDepartmentDesignationData(response4.data.message.filter(item => item.department== parseInt(location.state[0].department ))) 
                // console.log(response4.data.message)
                console.log(response4.data.message.filter(item => item.department== parseInt(location.state[0].department )))
                setDepartmentData(response5.data.message.filter(item => item.isActive==true))
            }
            else{
                setManagerData([])
                setRoleData([])
                setDesignationData([])
                setDepartmentData([])
                toast.error("Error Occured");
            }
        } 
        catch(error){      
            toast.error("Failed to fetch");
        }            
    }

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    firstName : e.target.firstName.value,
                    lastName : e.target.lastName.value,
                    email : e.target.email.value,
                    nic : e.target.nic.value,
                    department : e.target.department.value,
                    designation : e.target.designation.value,
                    manager : e.target.manager.value,
                    gender : e.target.gender.value,
                    emergencyContact : e.target.emergencyContact.value,
                    dateOfJoining : e.target.dateOfJoining.value,
                    phoneNumber : e.target.phoneNumber.value,
                    dob : e.target.dob.value,
                    religion : e.target.religion.value,
                    maritualStatus : e.target.maritualStatus.value,
                    isActive : e.target.isActive.value,
                    address : e.target.address.value,
                    modifiedby: user
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/employee/register', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                toast.success(response.message);
                navigate('/employee');
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to add new employee");
        }                
    };

    return ( 
        <React.Fragment>
            <div style={{backgroundColor:"#f5f5f5"}}>
                <div className=" mr-4 ml-4 pt-3" >
                    <Breadcrumb home="Home" navigation="Add Employee"/>
                </div>

                <div className="mt-3 mr-4 ml-4 pl-3 pr-3" style={{backgroundColor:"#FFFFFF"}}>
                    <div className='row mb-3'>
                        <div className='col'>
                            <h5 className="font-weight-bold pt-3">Edit Employee</h5>
                        </div>
                        <div className='col justify-content-end '>
                            <IconContext.Provider value={{ size: '30' }}>
                            <Button  variant="primary" className="btn-sm btn-info float-right mt-3 ml-3 mb-1" onClick={()=> navigate('/employee')} ><IoIcons.IoMdAddCircleOutline />View Employee List</Button >                  
                            </IconContext.Provider>    
                        </div>
                    </div>

                    <div>
                        <Form onSubmit={handleAddSubmit}>
                            <div>
                                <h6 className='font-weight-bold'>EMPLOYEE ACCOUNT</h6> <hr />
                            </div>

                            <Form.Group className="mb-3" >
                            <div className='row'>
                                <div className='col-md'>
                                    <Form.Label >User Role</Form.Label>
                                    <Form.Select name="userRole" required value={role} onChange={(e)=>{setRole(e.target.value)}}>
                                        {roleData.map(item=> <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </Form.Select>
                                </div>
                                <div className='col-md'>                                    
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter user name" name="uname" defaultValue={selectedRecord.email} disabled={true}/>                                           
                                </div>
                                <div className='col-md'>
                                </div>
                                <div className='col-md'>
                                </div>
                            </div>
                            
                            <div>
                                <h6 className='font-weight-bold mt-3'>PERSONAL INFORMATION</h6> <hr />
                            </div>

                            <div className='row'>
                                <div className='col-md'>                                
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" name="firstName" defaultValue={selectedRecord.firstName}   required/>                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" name="lastName" defaultValue={selectedRecord.lastName}  required/>                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>NIC</Form.Label>
                                    <Form.Control type="text" placeholder="Enter NIC" name="nic" defaultValue={selectedRecord.nic}  required/>                                           
                                </div>
                                <div className='col-md'>
                                <Form.Label >Gender</Form.Label>
                                <Form.Select name="gender" required defaultValue={location.state[0].gender} >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                                </div>
                            </div> 

                            <div className='row'>
                                <div className='col-md'>
                                    <Form.Label >Departnment Name</Form.Label>
                                    <Form.Select name="department" required value={department} onChange={(e)=>{setDepartment(e.target.value); setDepartmentDesignationData(designationData.filter(designation => designation.department== parseInt(e.target.value)))}}>
                                        {departmentData.map(item=> <option key={item.id} value={item.id}>{item.departmentName}</option>)}
                                    </Form.Select>
                                </div>
                                <div className='col-md'>
                                    <Form.Label >Designation Name</Form.Label>
                                    <Form.Select name="designation"  required value={designation} onChange={(e)=>setDesignation(e.target.value)} >
                                        {departmentDesignationData.map(item=> <option key={item.id} value={item.id}>{item.designationName}</option>)}
                                    </Form.Select>
                                </div>
                                <div className='col-md'>
                                    <Form.Label >Manager</Form.Label>
                                    <Form.Select name="manager" required value={manager} onChange={(e)=>setManager(e.target.value)}>
                                        {ManagerData.map(item=> <option key={item.id} value={item.id}>{item.firstName +' ' + item.lastName}</option>)}
                                    </Form.Select>
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control type="date" placeholder="Enter Date of Birth" name="dob" required defaultValue={selectedRecord.dob} />                                           
                                </div>
                            </div> 

                            <div className='row'>
                                <div className='col-md'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" name="email" required defaultValue={selectedRecord.email} disabled={true} />                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Phone Number" name="phoneNumber"  required defaultValue={selectedRecord.phoneNumber} />                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Emergency Contact</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Emergency Contact" name="emergencyContact" required defaultValue={selectedRecord.emergencyContact} />                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Religion</Form.Label>
                                    <Form.Control type="text" placeholder="Enter religion" name="religion" required defaultValue={selectedRecord.religion} />                                           
                                </div>
                            </div> 
                            
                            <div className='row'>
                                <div className='col-md'>
                                <Form.Label >Maritual Status</Form.Label>
                                <Form.Select name="maritualStatus"  required defaultValue={location.state[0].maritualStatus} >
                                    <option value="Unmarried">Unmarried</option>
                                    <option value="Maried">Maried</option>
                                </Form.Select>
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Address" name="address" required defaultValue={selectedRecord.address} />                                           
                                </div>
                                <div className='col-md'>
                                    <Form.Label>Date of Joining</Form.Label>
                                    <Form.Control type="date" placeholder="Enter Date of Joining" name="dateOfJoining" required defaultValue={selectedRecord.dateOfJoining} />                                           
                                </div>
                                <div className='col-md'>
                                <Form.Label >Status</Form.Label>
                                <Form.Select name="isActive" defaultValue={location.state[0].isActive} >
                                    <option value="true">Active</option>
                                    <option value="false">InActive</option>
                                </Form.Select>

                                </div>
                            </div> 


                            <div className='row' style={{width:"25%", marginLeft:"auto", marginRight:"auto"}}>
                                <Button variant="primary" type="submit"  size="md">
                                    Save 
                                </Button>
                            </div>
                            </Form.Group>
                        </Form>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    );
}
 
export default EditProfile;