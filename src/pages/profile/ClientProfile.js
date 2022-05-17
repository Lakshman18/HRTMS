import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from "../../Context";
import {toast} from 'react-toastify'
import './profile.css';
import {passwordValidation, comparePassword} from '../../utils/Validation';
import { useNavigate, useLocation} from 'react-router-dom';

const ClientProfile = () => {

    const [data, setData] = useState([]);
    const [user, token, userRole] = useContext(UserContext);
    const navigate = useNavigate();
    const [password1, setPassword1] = useState("");
    const [passwordErr, setPasswordErr] = useState("Error");
    const [passwordMatchErr, setPasswordMatchErr] = useState("Error");

    useEffect(() => {  
        getData()
    }, [])

    const getData = async(e) =>{
        try{
            const requestOptions = {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token                     
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/client/ClientView', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                console.log(response.message)
                setData(response.message)
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to add new employee");
        }                
    }

    const passwordCheck = (pass) => {
        setPasswordErr(passwordValidation(pass));
    }

    const compareBothPasswords = (pass) => {
        setPasswordMatchErr(comparePassword(password1,pass));
    }

    const handleEditSubmit =  async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    email : e.target.email.value,
                    id : e.target.id.value,
                    phone : e.target.phone.value,
                    taxNo : e.target.taxNo.value,
                    address : e.target.address.value,
                    modifiedBy: user
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/client/', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                toast.success(response.message);
                getData()
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to edit details");
        }                
    };

    const handlePasswordEditSubmit =  async(e) => {
        e.preventDefault();
        try{
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token ,
                    email: user,
                    oldPassword : e.target.oldPassword.value,
                    newPassword : e.target.newPassword.value
                })
            };
            let response = await fetch(process.env.REACT_APP_APIURL + '/client/PwdChange', requestOptions)
            response = await response.json();  
      
            if(response.status_code===200){
                toast.success(response.message);
                navigate('/logout')
            }
            else{
                toast.error(response.message);
            }    
        }    
        catch(error){  
            console.log(error)    
            toast.error("Failed to change the password");
        }                
    };

    return ( 
        <React.Fragment>
            <div >
                <div className="body container rounded bg-white mt-5 mb-5" >
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span className="font-weight-bold">{data.firstName}</span><span className="text-black-50">{data.email}</span><span> </span></div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Profile Settings</h4>
                                </div>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="form-group">
                                    
                                        <div className="row mt-3">
                                        <div className="col-md-12"><label className="labels">ID</label><input type="text" name="id" className="form-control"  defaultValue={data.id} disabled={true}/></div>
                                            <div className="col-md-12"><label className="labels">Email</label><input type="text" name="email" className="form-control" placeholder="enter email" defaultValue={data.email} disabled={true}/></div>
                                            <div className="col-md-12"><label className="labels">Mobile Number</label><input type="text" name="phone" className="form-control" placeholder="enter phone number" defaultValue={data.phone}/></div>
                                            <div className="col-md-12"><label className="labels">Address</label><input type="text" name="address" className="form-control" placeholder="address" defaultValue={data.address}/></div>
                                            <div className="col-md-12"><label className="labels">Tax No</label><input type="text" name="taxNo" className="form-control" placeholder="enter maritual status" defaultValue={data.taxNo}/></div>
                                        </div>
                                        <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit" >Save Profile</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 py-5">
                                <form onSubmit={handlePasswordEditSubmit}>
                                    <div className="form-group">
                                        <div className="d-flex justify-content-between align-items-center experience"><span>Change Password</span></div><br/>
                                        <div className="col-md-12"><label className="labels">Current Password</label><input type="password" className="form-control" placeholder="Old Password" name="oldPassword"/></div> <br/>
                                        <div className="col-md-12"><label className="labels">New Password</label><input onChange={e=> {setPassword1(e.target.value); passwordCheck(e.target.value)}} type="password" className="form-control" placeholder="New Password"  name="newPassword"/></div><br/>
                                        <div className="col-md-12"><label className="labels">Reenter New Password</label><input  disabled={passwordErr != "" ? true : false } onChange={e=> compareBothPasswords(e.target.value)} type="password" className="form-control" placeholder="Re Enter New Password"  name="newPassword1"/></div><br/>
                                        
                                        <div className="alert alert-danger" role="alert" hidden={passwordErr == "" || passwordErr == "Error"  ? true : false }>
                                            {passwordErr}
                                        </div>
                                        <div className="alert alert-danger" role="alert" hidden={passwordMatchErr == "" || passwordMatchErr == "Error"  ? true : false }>
                                            {passwordMatchErr}
                                        </div>
                                        <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit">Change Password</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
 
export default ClientProfile;