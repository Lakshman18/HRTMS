import React, {useState, useEffect, useContext} from 'react';
import Breadcrumb from '../../common/Breadcrumb'
import * as IoIcons from 'react-icons/io';
import { IconContext } from 'react-icons/lib';
import { Button,  Form } from 'react-bootstrap';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import {passwordValidation, comparePassword, NICvalidation, PhoneNoValidation} from '../../utils/Validation';

const AddEmployee = () => {

    const [ManagerData, setManagerData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [designationData, setDesignationData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentDesignationData, setDepartmentDesignationData] = useState([]);
    const [password1, setPassword1] = useState("");
    const [passwordErr, setPasswordErr] = useState("Error");
    const [passwordMatchErr, setPasswordMatchErr] = useState("Error");
    const [nicErr, setNicErr] = useState("Error");
    const [phoneNumberErr, setphoneNumberErr] = useState("Error");
    const [emergencyPhoneNumberErr, setEmergencyPhoneNumberErr] = useState("Error");
    const [user, token, userRole] = useContext(UserContext);
    const axios = require('axios');
    const navigate = useNavigate();

    useEffect(() => {  
        getData()
    }, [])

    const passwordCheck = (pass) => {
        setPasswordErr(passwordValidation(pass));
    }

    const compareBothPasswords = (pass) => {
        setPasswordMatchErr(comparePassword(password1,pass));
    }

    const validateNIC = (nic) => {
        setNicErr(NICvalidation(nic));
    }

    const validatePhoneNumber = (phoneNumber) => {
        setphoneNumberErr(PhoneNoValidation(phoneNumber));
    }

    const validateEmergencyPhoneNumber = (phoneNumber) => {
        setEmergencyPhoneNumberErr(PhoneNoValidation(phoneNumber));
    }
    
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
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    firstName : e.target.firstName.value,
                    lastName : e.target.lastName.value,
                    email : e.target.email.value,
                    password : e.target.password.value,
                    userRole : e.target.userRole.value,
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
                    createdBy: user
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
                            <h5 className="font-weight-bold pt-3">Add Employee</h5>
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
                            <div className='row'>
                                    <div className='col-md'>
                                    <Form.Label >User Role</Form.Label>
                                    <Form.Select name="userRole" required>
                                        {roleData.map(item=> <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </Form.Select>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>User Name</Form.Label>
                                        <Form.Control type="email" placeholder="Enter user name" name="uname" required/>                                           
                                    </Form.Group>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter password" name="password" onChange={e=> {setPassword1(e.target.value); passwordCheck(e.target.value)}}  required/>                                           
                                    </Form.Group>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Re Enter Password</Form.Label>
                                        <Form.Control type="password" placeholder="Re Enter password" name="password2" onChange={e=> compareBothPasswords(e.target.value)}
                                            disabled={passwordErr != "" ? true : false } required/>                                           
                                    </Form.Group>
                                    </div>
                            </div>

                            <div className="alert alert-danger" role="alert" hidden={passwordErr == "" || passwordErr == "Error"  ? true : false }>
                                {passwordErr}
                            </div>

                            <div className="alert alert-danger" role="alert" hidden={passwordMatchErr == "" || passwordMatchErr == "Error"  ? true : false }>
                                {passwordMatchErr}
                            </div>

                            <div>
                                <h6 className='font-weight-bold'>PERSONAL INFORMATIONT</h6> <hr />
                            </div>

                            <div className='row'>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter first name" name="firstName"  required/>                                           
                                    </Form.Group>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter last name" name="lastName"  required/>                                           
                                    </Form.Group>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>NIC</Form.Label>
                                        <Form.Control type="text" placeholder="Enter NIC" name="nic" onChange={e=> validateNIC(e.target.value)} required/>                                           
                                    </Form.Group>

                                    <div className="alert alert-danger" role="alert" hidden={nicErr == "" || nicErr == "Error" ? true : false }>
                                        {nicErr}
                                    </div>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Label >Gender</Form.Label>
                                    <Form.Select name="gender" required>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Select>
                                    </div>
                            </div> 

                            <div className='row'>
                                    <div className='col-md'>
                                    <Form.Label >Departnment Name</Form.Label>
                                    <Form.Select name="department" onChange={(des)=>{setDepartmentDesignationData(designationData.filter(designation => designation.department== parseInt(des.target.value)))}}  required>
                                        <option value="-" hidden default={true}>--</option>
                                        {departmentData.map(item=> <option key={item.id} value={item.id}>{item.departmentName}</option>)}
                                    </Form.Select>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Label >Designation Name</Form.Label>
                                    <Form.Select name="designation"  required>
                                        <option value="-" hidden default={true}>--</option>
                                        {departmentDesignationData.map(item=> <option key={item.id} value={item.id}>{item.designationName}</option>)}
                                    </Form.Select>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Label >Manager</Form.Label>
                                    <Form.Select name="manager" required>
                                        {ManagerData.map(item=> <option key={item.id} value={item.id}>{item.firstName +' ' + item.lastName}</option>)}
                                    </Form.Select>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="date" placeholder="Enter Date of Birth" name="dob" required/>                                           
                                    </Form.Group>
                                    </div>
                            </div> 

                            <div className='row'>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" name="email" required/>                                           
                                    </Form.Group>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text"  placeholder="Enter Phone Number" name="phoneNumber" onChange={e=> validatePhoneNumber(e.target.value)}  required/>                                           
                                    </Form.Group>

                                    <div className="alert alert-danger" role="alert" hidden={phoneNumberErr == "" || phoneNumberErr == "Error" ? true : false }>
                                        {phoneNumberErr}
                                    </div>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Emergency Contact</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Emergency Contact" name="emergencyContact" onChange={e=> validateEmergencyPhoneNumber(e.target.value)} required/>                                           
                                    </Form.Group>

                                    <div className="alert alert-danger" role="alert" hidden={emergencyPhoneNumberErr == "" || emergencyPhoneNumberErr == "Error" ? true : false }>
                                        {emergencyPhoneNumberErr}
                                    </div>

                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Religion</Form.Label>
                                        <Form.Control type="text" placeholder="Enter religion" name="religion" required/>                                           
                                    </Form.Group>
                                    </div>
                            </div> 
                            
                            <div className='row'>
                                    <div className='col-md'>
                                    <Form.Label >Maritual Status</Form.Label>
                                    <Form.Select name="maritualStatus"  required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="Unmarried">Unmarried</option>
                                        <option value="Maried">Maried</option>
                                    </Form.Select>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Address" name="address" required/>                                           
                                    </Form.Group>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Date of Joining</Form.Label>
                                        <Form.Control type="date" placeholder="Enter Date of Joining" name="dateOfJoining" required/>                                           
                                    </Form.Group>
                                    </div>
                                    <div className='col-md'>
                                    <Form.Label >Status</Form.Label>
                                    <Form.Select name="isActive"  required>
                                        <option value="-" hidden default={true}>--</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </Form.Select>
                                    </div>
                            </div> 

                            <div className='row' style={{width:"25%", marginLeft:"auto", marginRight:"auto"}}>
                                <Button variant="primary" type="submit"  size="md" 
                                        disabled={passwordErr != "" || passwordMatchErr != "" || nicErr !=  "" ||emergencyPhoneNumberErr !=  "" || phoneNumberErr !=  "" ? true : false}>
                                    Save 
                                </Button>
                            </div>

                        </Form>
                    </div>

                    
                </div>
            </div>
        </React.Fragment>
    );
}
 
export default AddEmployee;